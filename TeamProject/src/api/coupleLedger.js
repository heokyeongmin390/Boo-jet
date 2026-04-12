import api from './api';

/**
 * 부부의 이번 달 거래내역을 함께 가져옵니다.
 * 반환값은 원본 거래 배열입니다.
 */
export const getCoupleTransactions = async (userId, partnerId) => {
  const [myRes, partnerRes] = await Promise.all([
    api.get(`/transactions?userId=${userId}`),
    api.get(`/transactions?userId=${partnerId}`),
  ]);

  return [...myRes.data, ...partnerRes.data];
};

/**
 * 특정 월(YYYY-MM) 기준으로 부부 합산 요약을 계산합니다.
 */
export const getCoupleMonthlySummary = async (userId, partnerId, monthKey) => {
  const transactions = await getCoupleTransactions(userId, partnerId);

  const monthlyTransactions = transactions.filter((item) =>
    item.date.startsWith(monthKey),
  );

  const myTransactions = monthlyTransactions.filter(
    (item) => Number(item.userId) === Number(userId),
  );

  const partnerTransactions = monthlyTransactions.filter(
    (item) => Number(item.userId) === Number(partnerId),
  );

  const myIncome = myTransactions
    .filter((item) => item.type === 'INCOME')
    .reduce((sum, item) => sum + item.amount, 0);

  const partnerIncome = partnerTransactions
    .filter((item) => item.type === 'INCOME')
    .reduce((sum, item) => sum + item.amount, 0);

  const totalIncome = monthlyTransactions
    .filter((item) => item.type === 'INCOME')
    .reduce((sum, item) => sum + item.amount, 0);

  const myExpense = myTransactions
    .filter((item) => item.type === 'EXPENSE')
    .reduce((sum, item) => sum + item.amount, 0);

  const partnerExpense = partnerTransactions
    .filter((item) => item.type === 'EXPENSE')
    .reduce((sum, item) => sum + item.amount, 0);

  const totalExpense = monthlyTransactions
    .filter((item) => item.type === 'EXPENSE')
    .reduce((sum, item) => sum + item.amount, 0);

  const myProfit = myIncome - myExpense;
  const partnerProfit = partnerIncome - partnerExpense;
  const totalProfit = totalIncome - totalExpense;

  return {
    transactions: monthlyTransactions,
    myIncome,
    partnerIncome,
    totalIncome,
    myExpense,
    partnerExpense,
    totalExpense,
    myProfit,
    partnerProfit,
    totalProfit,
  };
};
