CREATE PROCEDURE `PointLevelInfo_Del`(
	IN SiteId INT,
    IN CurrencyId INT,
    IN PointLevel INT
)
BEGIN
	# 20200113@Tyler (BackendSite): Delete PointLevelInfoDetail by SiteId and CurrencyId and PointLevel
	DELETE FROM `Siebog`.PointLevelInfo WHERE PointLevelInfo.SiteId = SiteId AND PointLevelInfo.CurrencyId = CurrencyId AND PointLevelInfo.PointLevel = PointLevel;
END