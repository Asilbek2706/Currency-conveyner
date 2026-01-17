class Currency {
    #code;
    #rate;

    constructor(code, rate) {
        this.#code = code;
        this.#rate = rate;
    }

    get code() { return this.#code; }
    get rate() { return this.#rate; }

    display(container) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><span class="badge bg-light text-dark border p-2">${this.#code}</span></td>
            <td class="text-end fw-bold">${this.#rate.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
        `;
        container.appendChild(tr);
    }
}

class CurrencyConverter {
    #currencies;
    #fromSelect = document.getElementById('from-currency');
    #toSelect = document.getElementById('to-currency');
    #amountInput = document.getElementById('amount');
    #resultText = document.getElementById('result');
    #resultBox = document.getElementById('result-container');

    constructor(currencies) {
        this.#currencies = currencies;
        this.#setup();
    }

    #setup() {
        this.#currencies.forEach(curr => {
            this.#fromSelect.add(new Option(curr.code, curr.rate));
            this.#toSelect.add(new Option(curr.code, curr.rate));
        });

        document.getElementById("convert").onclick = () => this.#calculate();
    }

    #calculate() {
        const amount = parseFloat(this.#amountInput.value);
        if (!amount || amount <= 0) return;

        const fromRate = this.#fromSelect.value;
        const toRate = this.#toSelect.value;
        const result = (amount / fromRate) * toRate;

        this.#resultText.textContent = result.toLocaleString(undefined, {
            maximumFractionDigits: 2
        }) + " " + this.#toSelect.options[this.#toSelect.selectedIndex].text;

        this.#resultBox.classList.remove('d-none');
    }
}

class App {
    #list = document.getElementById('table-body');
    #currencies = [];

    constructor() {
        this.init();
    }

    async init() {
        try {
            const res = await fetch('https://api.frankfurter.dev/v1/latest?base=USD');
            const data = await res.json();

            this.#currencies = [
                new Currency(data.base, data.amount),
                ...Object.entries(data.rates).map(([c, r]) => new Currency(c, r))
            ];

            this.#render();
        } catch (e) {
            console.error("API Error:", e);
        }
    }

    #render() {
        this.#list.innerHTML = "";
        this.#currencies.forEach(c => c.display(this.#list));
        new CurrencyConverter(this.#currencies);
    }
}

new App();