
async function getFetchDataByUrl(url){
    const response  = await fetch(url)
  return  await response.json();
}

async function dataManipulation() {
    //add the refactoring ..
    const [orderData, invoicesData, pricesData] = await Promise.all([
      getFetchDataByUrl("https://static.nx.digital/orders.json"),
      getFetchDataByUrl("https://static.nx.digital/invoices.json"),
      getFetchDataByUrl("https://static.nx.digital/prices.json")
  ]);
    const orders = orderData.orders;
    const invoices = invoicesData.invoices;
    const prices = pricesData.prices;

    const articlePrices = {};
    prices.forEach(price => {
        articlePrices[price.article] = price.price;
    });

    const userTotals = {};
    // here we calculate the total prices for each user
    invoices.forEach(invoice => {
        const user = invoice.user;
        const order = orders.find(order => order.id === invoice.order);
        const articlePrice = articlePrices[order.article];
        const total = order.quantity * articlePrice;
        userTotals[user] = (userTotals[user] || 0) + total;
    });

    return  Object.keys(userTotals).map(user => {
        return { user: user, total: userTotals[user] };
    });
}


  dataManipulation().then((response)=>{
    console.log("expected",  response)
  });

