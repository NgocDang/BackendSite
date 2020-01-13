CREATE PROCEDURE `PointLevelInfo_Ins`(
	IN SiteId INT,
    IN CurrencyId INT,
    IN PointLevel INT,
    IN BetLeast decimal(18,2),
    IN DepositLeast decimal(18,2)
)
BEGIN
	# 20200111@Tyler(BackendSite): Add new PointLevelInfo
	INSERT INTO PointLevelInfo(SiteId,CurrencyId,PointLevel,BetLeast,DepositLeast)
	SELECT 
		SiteId,
		CurrencyId,
		PointLevel,
		BetLeast,
		DepositLeast
	FROM DUAL WHERE
		NOT EXISTS( SELECT 
				1
			FROM
				PointLevelInfo
			WHERE
				PointLevelInfo.SiteID = SiteId
					AND PointLevelInfo.CurrencyId = CurrencyId
					AND PointLevel.PointLevel = PointLevel);
END