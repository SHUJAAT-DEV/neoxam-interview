async function getFetchDataByUrl(url){
  const response  = await fetch(url)
return  await response.json();
}
async function loadAllData(){
      const [orderData, invoicesData, pricesData] = await Promise.all([
        getFetchDataByUrl("https://static.nx.digital/orders.json"),
        getFetchDataByUrl("https://static.nx.digital/invoices.json"),
        getFetchDataByUrl("https://static.nx.digital/prices.json")
    ]);
  return {orders: orderData.orders ,invoices:invoicesData.invoices,prices:pricesData.prices}
}
function getArticlePrice(prices){
 return prices.reduce((acc, price) => {
    acc[price.article] = price.price;
    return acc;
}, {});
}

function getUserTotal(invoices ,orders,articlePrices){
  const userTotals = {};
  invoices.forEach(invoice => {
      const user = invoice.user;
      const order = orders.find(order => order.id === invoice.order);
      const articlePrice = articlePrices[order.article];
      const total = order.quantity * articlePrice;
      userTotals[user] = (userTotals[user] || 0) + total;
  });
  return userTotals;
}
function formatDataAsPerRequirement(){
  return  Object.keys(userTotals).map(user => {
    return { user: user, total: userTotals[user] };
});
}

// now user can easily read the code .
async function calculateUserPrice() {
    const{orders ,invoices,prices} = await loadAllData()
    const articlePrices = getArticlePrice(prices)
    const userTotals = getUserTotal(invoices ,orders,articlePrices);
    return formatDataAsPerRequirement(userTotals);
}

// display the expect user prices 
calculateUserPrice().then((response)=>{
    console.log("expected user price",  response)
  });

