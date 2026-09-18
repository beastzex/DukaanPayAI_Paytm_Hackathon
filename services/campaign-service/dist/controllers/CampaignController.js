"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignController = void 0;
const CampaignService_1 = require("../services/CampaignService");
const shared_validators_1 = require("@dukaanpay/shared-validators");
const common_utils_1 = require("@dukaanpay/common-utils");
class CampaignController {
    service;
    constructor() {
        this.service = new CampaignService_1.CampaignService();
    }
    draft = async (req, res, next) => {
        try {
            const parsed = shared_validators_1.DraftCampaignSchema.safeParse(req.body);
            if (!parsed.success) {
                throw new common_utils_1.ValidationError('Invalid campaign draft', parsed.error.format());
            }
            const merchantId = req.body.merchantId || req.headers['x-merchant-id'];
            if (!merchantId) {
                throw new common_utils_1.ValidationError('merchantId required');
            }
            const campaign = await this.service.draftCampaign(merchantId, parsed.data, req.headers['x-correlation-id'] || 'campaign-draft');
            const response = {
                success: true,
                data: campaign,
                meta: {
                    timestamp: new Date().toISOString(),
                    requestId: req.headers['x-correlation-id'] || 'local',
                    version: '1.0.0',
                },
            };
            res.status(201).json(response);
        }
        catch (error) {
            next(error);
        }
    };
    approve = async (req, res, next) => {
        try {
            const parsed = shared_validators_1.ApproveCampaignSchema.safeParse(req.body);
            if (!parsed.success) {
                throw new common_utils_1.ValidationError('Invalid campaign approval payload', parsed.error.format());
            }
            const campaign = await this.service.handleApproval(parsed.data, req.headers['x-correlation-id'] || 'campaign-approval');
            res.status(200).json({
                success: true,
                data: campaign,
                meta: {
                    timestamp: new Date().toISOString(),
                    requestId: req.headers['x-correlation-id'] || 'local',
                    version: '1.0.0',
                },
            });
        }
        catch (error) {
            next(error);
        }
    };
    getCampaigns = async (req, res, next) => {
        try {
            const merchantId = req.query.merchantId || req.headers['x-merchant-id'];
            if (!merchantId) {
                throw new common_utils_1.ValidationError('merchantId required');
            }
            const campaigns = await this.service.getMerchantCampaigns(merchantId);
            res.status(200).json({
                success: true,
                data: campaigns,
                meta: {
                    timestamp: new Date().toISOString(),
                    requestId: req.headers['x-correlation-id'] || 'local',
                    version: '1.0.0',
                },
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.CampaignController = CampaignController;
//# sourceMappingURL=CampaignController.js.map