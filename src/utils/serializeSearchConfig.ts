export interface SearchConfig {
    scheduledAggregations: {
        descriptions: Array<string>
        creditsPerSearch: Array<number>
        dailySearches: Array<number>
        daysScheduled: Array<number>
    },
    scheduledSearches: {
        descriptions: Array<string>,
        creditsPerSearch: Array<number>,
        dailySearches: Array<number>,
        daysScheduled: Array<number>
    },
    adhocSearches: {
        descriptions: Array<string>,
        creditsPerSearch: Array<number>,
        searchesPerSession: Array<number>,
        weeklySessions: Array<number>,
        weeklyUsers: Array<number>
    }
}

export function serializeSearchConfig(
    allScheduledAggregationDescription: Array<string>,
    allScheduledAggregationCreditsPerSearch: Array<number>,
    allScheduledAggregationDailySearches: Array<number>,
    allScheduledAggregationDaysScheduled: Array<number>,

    allScheduledSearchesDescription: Array<string>,
    allScheduledSearchesCreditsPerSearch: Array<number>,
    allScheduledSearchesDailySearches: Array<number>,
    allScheduledSearchesDaysScheduled: Array<number>,

    allAdhocSearchesDescription: Array<string>,
    allAdhocSearchesCreditsPerSearch: Array<number>,
    allAdhocSearchesPerSession: Array<number>,
    allAdhocSearchesWeeklySessions: Array<number>,
    allAdhocSearchesWeeklyUsers: Array<number>
) {
    return JSON.stringify(
        {
            scheduledAggregations: {
                descriptions: allScheduledAggregationDescription,
                creditsPerSearch: allScheduledAggregationCreditsPerSearch,
                dailySearches: allScheduledAggregationDailySearches,
                daysScheduled: allScheduledAggregationDaysScheduled
            },
            scheduledSearches: {
                descriptions: allScheduledSearchesDescription,
                creditsPerSearch: allScheduledSearchesCreditsPerSearch,
                dailySearches: allScheduledSearchesDailySearches,
                daysScheduled: allScheduledSearchesDaysScheduled
            },
            adhocSearches: {
                descriptions: allAdhocSearchesDescription,
                creditsPerSearch: allAdhocSearchesCreditsPerSearch,
                searchesPerSession: allAdhocSearchesPerSession,
                weeklySessions: allAdhocSearchesWeeklySessions,
                weeklyUsers: allAdhocSearchesWeeklyUsers
            }
        }
    );
}