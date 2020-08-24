SELECT flights.id, flights.date, flights.takeoffTime, airframes.rego, models.model, airframes.mark, 
airfields.name "Location", launchmethods.nameShort Launch, p1.surname P1, p2.surname P2, flights.minutes, 
flights.landings, flights.track, flights.url, flights.comments 
FROM ((((flights LEFT JOIN (airframes LEFT JOIN models ON airframes.modelId=models.id) 
ON flights.airframeId=airframes.id) LEFT JOIN airfields ON flights.takeoffLocId=airfields.id) 
LEFT JOIN launchmethods ON flights.launchId=launchmethods.id) LEFT JOIN pilots p1 ON flights.p1Id=p1.id) 
LEFT JOIN pilots p2 ON flights.p2Id=p2.id;