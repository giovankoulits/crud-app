const buttons = document.querySelectorAll("button");
buttons.forEach((btn) =>
  btn.addEventListener("click", (e) => fetchQuote(btn.innerText.toLowerCase()))
);

async function fetchQuote(char) {
  const res = await fetch(
    `https://southparkquotes.onrender.com/v1/quotes/search/${char}`
  );
  const quoteArray = await res.json();
  const randomQuote =
    quoteArray[Math.floor(quoteArray.length * Math.random())].quote;
  document.querySelector("h2").innerText = randomQuote;
  if (typeof randomQuote === "string") {
    const request = await fetch("http://localhost:3000/", {
      method: "POST",
      body: randomQuote,
    });
  }
}
