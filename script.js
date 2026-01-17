class Currency {
    #code;
    #rate;

    constructor(code, rate) {
        this.#code = code;
        this.#rate = rate;
    }

    get code() {
        return this.#code;
    }

    get rate() {
        return this.#rate;
    }

    display(container) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${this.code}</td>
            <td>${this.rate}</td>
        `;
        container.appendChild(tr);
    }
}

class CurrencyConverter {
    #currencies;

    constructor(currencies) {
        this.#currencies = currencies;
        this.#populateSelect('from-currency');
        this.#populateSelect('to-currency');
        document.getElementById("convert").addEventListener('click', this.#convert);
    }

    #populateSelect(selectId) {
        const selectElement = document.getElementById(selectId);
        this.#currencies.forEach(currency => {
            const option = document.createElement("option");
            option.value = currency.rate;
            option.label = currency.code;
            selectElement.appendChild(option);
        })
    }

    #convert() {
        const fromCurrency = document.getElementById("from-currency").value;
        const amount = parseFloat(document.getElementById("amount").value);
        const toCurrency = document.getElementById("to-currency").value;
        const result = amount * toCurrency / fromCurrency;
        document.getElementById("result").textContent = `Result: ${result}`;
    }
}

class App {
    #list;
    #currencies;
    constructor() {
        this.#init();
    }

    async #init() {
        this.#list = document.getElementById('table-body');
        const response = await fetch('https://api.frankfurter.dev/v1/latest?base=USD')
        const result = await response.json();
        this.#transformResult(result);
        this.#renderCurrencies();
        this.#renderConverter();
    }

    #transformResult(result) {
        const { base, amount, rates } = result;
        const baseCurrency = new Currency(base, amount);
        const otherCurrencies = Object.entries(rates).map(([code, rate]) => new Currency(code, rate))
        this.#currencies = [baseCurrency, ...otherCurrencies];
    }

    #renderCurrencies() {
        this.#currencies.forEach( currency  => currency.display(this.#list));
    }

    #renderConverter() {
        new CurrencyConverter(this.#currencies);
    }
}

new App();