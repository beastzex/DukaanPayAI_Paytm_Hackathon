"""
Paytm Merchant Growth Agent — XGBoost Inventory Stockout Classifier
Trains an XGBClassifier on Kirana SKU telemetry to predict stockout risk within 24 hours.
Computes ROC-AUC, precision/recall, and feature importances.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score

def train_xgboost_model(data_path="ml/data/kirana_transactions.csv", model_dir="ml/models"):
    os.makedirs(model_dir, exist_ok=True)
    print("Loading transaction dataset for XGBoost training...")
    df = pd.read_csv(data_path)
    
    # Feature engineering per transaction / SKU state
    features = [
        "current_shelf_stock",
        "supplier_lead_time_h",
        "quantity",
        "unit_price",
        "gross_margin",
        "hour",
        "day_of_week",
        "is_weekend",
        "is_raining",
        "is_festival",
        "is_ipl_match"
    ]
    
    X = df[features].copy()
    y = df["stockout_within_24h"].values

    # Train / Test split (80% train, 20% test, stratified)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    print(f"Training XGBoost on {len(X_train)} samples; Testing on {len(X_test)} samples...")
    print(f"Positive stockout class balance: {y.sum()} / {len(y)} ({y.mean()*100:.2f}%)")

    # XGBoost classifier configuration for retail risk
    scale_pos_weight = (len(y) - y.sum()) / y.sum()
    clf = XGBClassifier(
        n_estimators=120,
        max_depth=5,
        learning_rate=0.06,
        subsample=0.85,
        colsample_bytree=0.85,
        scale_pos_weight=scale_pos_weight,
        random_state=42,
        eval_metric="logloss"
    )

    clf.fit(X_train, y_train)

    # Predictions and probabilities
    y_pred = clf.predict(X_test)
    y_prob = clf.predict_proba(X_test)[:, 1]

    acc = float(accuracy_score(y_test, y_pred))
    prec = float(precision_score(y_test, y_pred, zero_division=0))
    rec = float(recall_score(y_test, y_pred, zero_division=0))
    f1 = float(f1_score(y_test, y_pred, zero_division=0))
    roc_auc = float(roc_auc_score(y_test, y_prob))

    print(f"[XGBOOST METRICS] Accuracy: {acc*100:.2f}% | ROC-AUC: {roc_auc:.4f} | F1: {f1:.4f} | Precision: {prec:.4f} | Recall: {rec:.4f}")

    # Feature importances
    importances = clf.feature_importances_
    feat_importance_list = []
    for name, imp in sorted(zip(features, importances), key=lambda x: x[1], reverse=True):
        feat_importance_list.append({
            "feature": name,
            "importance_pct": round(float(imp) * 100, 2)
        })

    print("Top Predictive Signals:")
    for f in feat_importance_list[:5]:
        print(f"  - {f['feature']}: {f['importance_pct']}%")

    # Save model artifact
    model_path = os.path.join(model_dir, "xgboost_inventory_model.joblib")
    joblib.dump(clf, model_path)
    print(f"[SAVED] Serialized XGBoost model to {model_path}")

    # Generate current active SKU stockout predictions for live API and UI
    latest_skus = df.groupby("sku").last().reset_index()
    sku_predictions = []
    for _, row in latest_skus.iterrows():
        sample_feat = pd.DataFrame([{
            "current_shelf_stock": row["current_shelf_stock"],
            "supplier_lead_time_h": row["supplier_lead_time_h"],
            "quantity": row["quantity"],
            "unit_price": row["unit_price"],
            "gross_margin": row["gross_margin"],
            "hour": 11, # Morning check
            "day_of_week": 4, # Friday
            "is_weekend": 0,
            "is_raining": 0,
            "is_festival": 0,
            "is_ipl_match": 0
        }])
        prob = float(clf.predict_proba(sample_feat)[0, 1]) * 100
        
        # Risk assessment category
        if prob >= 75 or row["current_shelf_stock"] <= 6:
            risk = "CRITICAL"
        elif prob >= 40 or row["current_shelf_stock"] <= 14:
            risk = "WARNING"
        else:
            risk = "HEALTHY"

        sku_predictions.append({
            "sku": row["sku"],
            "name": row["sku_name"],
            "category": row["category"],
            "current_stock": int(row["current_shelf_stock"]),
            "supplier_lead_time_h": int(row["supplier_lead_time_h"]),
            "stockout_probability_pct": round(prob, 1),
            "risk_category": risk,
            "recommended_reorder_qty": 48 if risk == "CRITICAL" else (24 if risk == "WARNING" else 0)
        })

    preds_path = os.path.join(model_dir, "xgboost_predictions.json")
    with open(preds_path, "w") as f:
        json.dump({
            "metrics": {
                "accuracy": round(acc * 100, 2),
                "roc_auc": round(roc_auc, 4),
                "f1_score": round(f1, 4),
                "precision": round(prec, 4),
                "recall": round(rec, 4),
                "train_samples": len(X_train),
                "test_samples": len(X_test),
            },
            "feature_importances": feat_importance_list,
            "sku_predictions": sku_predictions
        }, f, indent=2)

    print(f"[SAVED] SKU predictions to {preds_path}")
    return {"accuracy": acc, "roc_auc": roc_auc, "f1": f1}

if __name__ == "__main__":
    train_xgboost_model()
