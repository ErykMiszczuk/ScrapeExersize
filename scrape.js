const puppeteer = require("puppeteer");

(async () => {
  console.log("Hello there!");

  const extractBookData = async (_url) => {
    const page = await browser.newPage();
    page.goto(_url);
    const details = await page.evaluate(() => {
      let publisher = document.querySelector('td[itemprop=publisher] > a').title;
        let ISBN = document.querySelector('td[itemprop=isbn]').textContent;
        let categories = document.querySelector('p.product_categories').textContent;
        let pages = document.querySelector('td[itemprop=numberOfPages]').textContent;
        return {
          publisher: publisher,
          isbn: ISBN,
          categories: categories,
          pages: pages
        }
    })
    await page.close();
    return details;
  }


  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto("https://www.gandalf.com.pl/os/child-lee/");

  let output = await page.evaluate(() => {
    let listOfBooks = Array.from(
      document.querySelectorAll("div.prod:not(.unavailable)")
    ).filter(book => {
      return book.querySelector('p.pgname').textContent.trim() == "książka"
    })
    .map(book => {
      let author = book.querySelector(".person").textContent;
      let title = book.querySelector(".cart_link").getAttribute("data-name");
      let price = book.querySelector('.new_price').textContent;
      let thumb = book.querySelector('img.pimage').src;
      let pageInfo = book.querySelector('div.pimage > a').href;
      return {
        authors: [author],
        title: title,
        price: price,
        thumb: thumb,
        pageInfo: pageInfo,
      };
    });

    

    //   for(book of listOfBooks) {
    //   await page.goto(book.pageInfo);
    //   let info = await page.evaluate(() => {
    //     let publisher = document.querySelector('td[itemprop=publisher] > a').title;
    //     let ISBN = document.querySelector('td[itemprop=isbn]').textContent;
    //     let categories = document.querySelector('p.product_categories').textContent;
    //     let pages = document.querySelector('td[itemprop=numberOfPages]').textContent;
    //     return {
    //       publisher: publisher,
    //       isbn: ISBN,
    //       categories: categories,
    //       pages: pages
    //     }
    //   })
    //   return {
    //     ...book,
    //     ...info
    //   }
    // }
    return listOfBooks;
  });
  output.map(book => {
    
    console.log(extractBookData(book.pageInfo))
    
  });
  console.log(output);
  await page.close();
  console.log("Goodbye!");
  browser.close();
})();

// TODO:
// And now im think it is time for recursion and some more await 