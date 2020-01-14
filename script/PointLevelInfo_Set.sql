CREATE PROCEDURE `PointLevelInfo_Set`(
	IN SiteId INT,
    IN CurrencyId INT,
    IN PointLevel INT,
    IN BetLeast decimal(18,2),
    IN DepositLeast decimal(18,2)
)
BEGIN
	# 20200111@Tyler(BackendSite): Edit PointLeveInfo
	UPDATE PointLevelInfo 
	SET 
        PointLevelInfo.BetLeast = BetLeast,
        PointLevelInfo.DepositLeast = DepositLeast
	WHERE
		PointLevelInfo.SiteId = SiteId
			AND PointLevelInfo.CurrencyId = CurrencyId
			AND PointLevelInfo.PointLevel = PointLevel;
END