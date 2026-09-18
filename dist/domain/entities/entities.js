"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationStatus = exports.NotificationChannel = exports.CampaignStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["MERCHANT"] = "MERCHANT";
    UserRole["ADMIN"] = "ADMIN";
    UserRole["SUPPORT"] = "SUPPORT";
    UserRole["CREDIT_OFFICER"] = "CREDIT_OFFICER";
})(UserRole || (exports.UserRole = UserRole = {}));
var CampaignStatus;
(function (CampaignStatus) {
    CampaignStatus["DRAFT"] = "DRAFT";
    CampaignStatus["SCHEDULED"] = "SCHEDULED";
    CampaignStatus["PROCESSING"] = "PROCESSING";
    CampaignStatus["COMPLETED"] = "COMPLETED";
    CampaignStatus["FAILED"] = "FAILED";
    CampaignStatus["CANCELLED"] = "CANCELLED";
})(CampaignStatus || (exports.CampaignStatus = CampaignStatus = {}));
var NotificationChannel;
(function (NotificationChannel) {
    NotificationChannel["WHATSAPP"] = "WHATSAPP";
    NotificationChannel["VOICE"] = "VOICE";
    NotificationChannel["SMS"] = "SMS";
    NotificationChannel["EMAIL"] = "EMAIL";
})(NotificationChannel || (exports.NotificationChannel = NotificationChannel = {}));
var NotificationStatus;
(function (NotificationStatus) {
    NotificationStatus["QUEUED"] = "QUEUED";
    NotificationStatus["SENDING"] = "SENDING";
    NotificationStatus["SENT"] = "SENT";
    NotificationStatus["DELIVERED"] = "DELIVERED";
    NotificationStatus["FAILED"] = "FAILED";
})(NotificationStatus || (exports.NotificationStatus = NotificationStatus = {}));
//# sourceMappingURL=entities.js.map