CREATE PROCEDURE `PointLevelInfoDetail_Get`(
	IN SiteId INT,
    IN CurrencyId INT,
    IN PointLevel INT
)
BEGIN
	# 20200113@Tyler (BackendSite): Get PointLevelInfoDetail by SiteId and CurrencyId and PointLevel
	SELECT 
		PointLevelInfo.SiteId, 
        PointLevelInfo.CurrencyId, 
        PointLevelInfo.PointLevel, 
        PointLevelInfo.DepositLeast, 
        PointLevelInfo.BetLeast
	FROM
		PointLevelInfo
	WHERE
		PointLevelInfo.SiteId = SiteId
        AND PointLevelInfo.CurrencyId = CurrencyId
        AND PointLevelInfo.PointLevel = PointLevel;
END