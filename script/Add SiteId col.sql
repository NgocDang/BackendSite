ALTER TABLE `siebog`.`pointlevelinfo` 
ADD COLUMN `SiteId` INT NOT NULL FIRST,
DROP PRIMARY KEY,
ADD PRIMARY KEY (`SiteId`, `CurrencyId`, `PointLevel`);
;