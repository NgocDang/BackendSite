CREATE PROCEDURE `PointLevelInfo_Get`(
	IN SiteId INT,
    IN CurrencyId INT
)
BEGIN
	# 20200111@Tyler (BackendSite): Get PointLevelInfo by SiteId and CurrencyId
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
        AND PointLevelInfo.CurrencyId = CurrencyId;
END