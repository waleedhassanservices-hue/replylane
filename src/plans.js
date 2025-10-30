export const plans = {
  starter: { id: "starter", label: "Starter", seats: 2, dailyDrafts: 40, priceUsd: 19 },
  team: { id: "team", label: "Team", seats: 10, dailyDrafts: 300, priceUsd: 79 },
};

export function planById(id) {
  return plans[id] || plans.starter;
}

export function withinSeatLimit(planId, seats) {
  return seats > 0 && seats <= planById(planId).seats;
}

export function draftsRemaining(planId, usedToday) {
  return Math.max(0, planById(planId).dailyDrafts - usedToday);
}
