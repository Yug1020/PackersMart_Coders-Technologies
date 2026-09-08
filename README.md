# PackersMart_Coders-Technologies
Build a small working MVP based on the PackersMart lead-to-booking workflow

Step 1: Assign Points Based on Lead InformationA. 
Urgency Score (Based on Moving Date)
Moving within 7 days: +40 points (High urgency – customer is ready to hire)
Moving within 8 to 30 days: +20 points (Moderate urgency – active planning phase)
Moving in 30+ days / No fixed date: +5 points (Low urgency – just browsing/researching)

B. Value Score (Based on Distance & Service)
Distance (From Place vs. To Place):

Long Distance: +30 points
Short Distance: +10 points

Service Type:
Commercial Service (offices, factories): +30 points (Higher ticket value)
Domestic Service (homes, shops): +15 points (Standard ticket value)


Step 2: Calculate Total Lead ScoreAdd the points from each category together to get a total score out of 100 points:
$$\text{Total Score} = \text{Urgency Score} + \text{Distance Score} + \text{Service Score}$$

Step 3: Classify into Hot, Warm, or Cold
Hot Lead (70 - 100 points):Example: A commercial office moving long distance next week.Meaning: High-value, immediate conversion opportunity. Assign to sales immediately.
Warm Lead (40 - 69 points):Example: A home moving locally next week, or a long-distance office move planned for next month.Meaning: Good potential. Needs a quick follow-up or automated quote.
Cold Lead (Below 40 points):Example: A local home move scheduled 2 months away.Meaning: Low priority or low value. Put into an automated nurture list or follow up later.