import { useState, useEffect } from "react";
import axios from "axios";
import Devise_Selectionner from "./Devise_Selectionner";
import Swal from "sweetalert2";
import "./Converssion.css";

const API_KEY = "b99a0fd2f69672b5a39e746c";

const Converssion = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [amount, setAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(null);

  useEffect(() => {
    // Animation au chargement
    const container = document.querySelector('.app-container');
    if (container) {
      container.classList.add('fade-in');
    }
    
    // Récupérer la liste des devises disponibles
    setIsLoading(true);
    axios
      .get(`https://v6.exchangerate-api.com/v6/${API_KEY}/codes`)
      .then((response) => {
        setCurrencies(response.data.supported_codes);
        setIsLoading(false);
      })
      .catch(() => {
        setError("Erreur lors du chargement des devises");
        setIsLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de charger les devises. Veuillez réessayer plus tard.',
          confirmButtonColor: '#3051a3'
        });
      });
  }, []);

  // Obtenir le taux de change actuel
  useEffect(() => {
    if (fromCurrency && toCurrency) {
      axios
        .get(`https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${fromCurrency}/${toCurrency}`)
        .then((response) => {
          setExchangeRate(response.data.conversion_rate);
        })
        .catch(() => {
          // Échec silencieux
        });
    }
  }, [fromCurrency, toCurrency]);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Accepter seulement les chiffres et le point décimal
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    // Animation sur le bouton d'échange
    const swapBtn = document.getElementById('swap-btn');
    if (swapBtn) {
      swapBtn.classList.add('rotate');
      setTimeout(() => swapBtn.classList.remove('rotate'), 500);
    }
  };

  const convertCurrency = () => {
    // Validation du montant
    if (!amount || amount <= 0 || isNaN(amount)) {
      Swal.fire({
        icon: 'warning',
        title: 'Entrée invalide',
        text: 'Veuillez entrer un montant numérique valide.',
        confirmButtonColor: '#3051a3'
      });
      return;
    }
    
    setError("");
    setIsLoading(true);
    
    // Animation du bouton
    const convertBtn = document.querySelector('.convert-btn');
    if (convertBtn) {
      convertBtn.classList.add('pulse');
      setTimeout(() => convertBtn.classList.remove('pulse'), 500);
    }

    axios
      .get(
        `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${fromCurrency}/${toCurrency}/${amount}`
      )
      .then((response) => {
        setConvertedAmount(response.data.conversion_result);
        setIsLoading(false);
        
        // Animation du résultat
        const resultElement = document.querySelector('.result');
        if (resultElement) {
          resultElement.classList.remove('pop-in');
          void resultElement.offsetWidth; // Force reflow
          resultElement.classList.add('pop-in');
        }
        
        Swal.fire({
          icon: 'success',
          title: 'Conversion réussie!',
          text: `${amount} ${fromCurrency} = ${response.data.conversion_result.toFixed(2)} ${toCurrency}`,
          confirmButtonColor: '#3051a3',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      })
      .catch(() => {
        setError("Erreur lors de la conversion.");
        setIsLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Échec de la conversion',
          text: 'Une erreur est survenue lors de la conversion. Veuillez réessayer.',
          confirmButtonColor: '#3051a3'
        });
      });
  };

  return (
    <div className="converter-wrapper">
      <div className="app-container">
        <div className="converter-card">
          <h1 className="app-title">
            <span className="icon-currency">💱</span> 
            Convertisseur de Devises
          </h1>
         
          <div className="input-section">
            <div className="amount-container">
              <label htmlFor="amount-input" className="input-label">Montant</label>
              <input
                id="amount-input"
                type="text"
                value={amount}
                onChange={handleAmountChange}
                placeholder="Entrez un montant"
                className="amount-input"
              />
            </div>
            
            <div className="currencies-selection">
              <div className="currency-wrapper">
                <label className="currency-title">De</label>
                <select
                  className="currency-select"
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                >
                  {currencies.map((curr) => (
                    <option key={curr[0]} value={curr[0]}>
                      {curr[0]} - {curr[1]}
                    </option>
                  ))}
                </select>
              </div>
              
              <button id="swap-btn" className="swap-button" onClick={swapCurrencies}>
                <span>⇄</span>
              </button>
              
              <div className="currency-wrapper">
                <label className="currency-title">Vers</label>
                <select
                  className="currency-select"
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                >
                  {currencies.map((curr) => (
                    <option key={curr[0]} value={curr[0]}>
                      {curr[0]} - {curr[1]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {exchangeRate && (
              <div className="exchange-rate">
                <p>1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}</p>
              </div>
            )}
          </div>
          
          <button 
            className="convert-btn" 
            onClick={convertCurrency}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading-spinner"></span>
            ) : (
              "Convertir"
            )}
          </button>
          
          {error && <p className="error-message">{error}</p>}
          
          {convertedAmount !== null && (
            <div className="result">
              <h2>Résultat</h2>
              <div className="conversion-result">
                <span className="amount-from">{parseFloat(amount).toFixed(2)} {fromCurrency}</span>
                <span className="equals">=</span>
                <span className="amount-to">{convertedAmount.toFixed(2)} {toCurrency}</span>
              </div>
            </div>
          )}
        </div>
        
        <footer className="footer">
          <p>© {new Date().getFullYear()} Convertisseur de Devises | Taux fournis par ExchangeRate-API</p>
        </footer>
      </div>
    </div>
  );
};

export default Converssion;