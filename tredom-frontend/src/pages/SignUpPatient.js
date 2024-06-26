import React, { useState, useEffect } from 'react';
import '../styles/SignUp.css';
import logo from '../assets/images/logo.png';
import { useNavigate, useLocation } from 'react-router-dom';
import OptionField from '../components/OptionField';

const SignUpPatient = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    password: '',
    confirmPassword: '',
    profileType: '',
    date: '',
    city: '',
    medicalregister: '',
    medicalspecialty: '',
    phone: '',
    gender:'',
  });

  useEffect(() => {
    if (location.state) {
      const { email, fullName, password, confirmPassword, profileType, date, city,  medicalregister, medicalspecialty, phone, gender } = location.state;
      setFormData({
        ...formData,
        email,
        fullName,
        password,
        confirmPassword,
        profileType,
        date,
        city,
        medicalregister,
        medicalspecialty,
        phone,
        gender
      });
    }
  }, [location.state]);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRedirectBack = () => {
    navigate('/cadastro', { state: formData });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const registerPatient  = {
      "email": formData.email,
      "password": formData.password,
      "profile_type": 'patient',
      "patient": {
        "name": formData.fullName,
        "birthday": formData.date,
        "location": formData.city,
        "gender": formData.gender,
      }
    };
    
    try {
      const response = await fetch('http://127.0.0.1:5000/finish-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerPatient),
      });
  
      if (response.ok) {
          alert('Cadastro realizado com sucesso!');
          navigate('/login');
      } else {
        const errorData = await response.json();
        console.log(errorData)
        if (errorData.message === 'All fields are required.'){
          setErrorMessage('Preencha todos os campos.');
        }
        else if (errorData.message === 'city must contain only letters.'){
          setErrorMessage('Município precisa conter apenas letras.');
        }
        else if (errorData.message === 'The provided date cannot be in the future.'){
          setErrorMessage('A data de nascimento inválida.');
        }
        else if (errorData.message === 'non_field_errors: Phone must contain only digits.'){
          setErrorMessage('O telefone precisa conter apenas números.');
        }
        else if (errorData.message === 'non_field_errors: city must contain only letters.'){
          setErrorMessage('O município precisa conter apenas letras.');
        }
        else {
          setErrorMessage('Erro. Tente novamente.');
          console.log(errorData.message)
        }
      }
    } catch (error) {
      console.error('Erro:', error);
      setErrorMessage('Erro. Tente novamente.');
    }
  };


  return (
    <div className="signup-container">
      <div className="signup-section">
        <div className='logo-img'>
          <img src={logo} alt="Logo" className="logo-image" />
        </div>
        <div className='signup-title'>
          <h2>Crie sua Conta</h2>
          <div className='error-message'>{errorMessage}</div>
        </div>
        <div className='signup-form'>
          <form>
            <div className='form-text-input-container'>
              <div>
                <div className='form-text-input-container-div'>
                  <div className='signup-label'>Data de Nascimento:</div>
                  <input
                    type="date" 
                    id="date" 
                    name="date"  
                    className='email-input' 
                    placeholder="dd/mm/aaaa"
                    value={formData.date} 
                    onChange={handleInputChange}/>
                </div>
                <div className='form-text-input-container-div'>
                  <OptionField
                    title="Gênero:"
                    option1="Feminino"
                    option2="Masculino"
                    onChange={(value) =>handleInputChange({ target: { name: 'gender', value: value} })}
                    value={formData.gender} 
                  />
                </div>
              </div> 
              <div>
                <div className='form-text-input-container-div'>
                  <div className='signup-label'>Município</div>
                  <input 
                    type="city" 
                    id="city" name="city" 
                    className='email-input' 
                    placeholder="Município"
                    value={formData.city} 
                    onChange={handleInputChange}/>
                </div>
                <div className='form-text-input-container-div'>
                    <div className='signup-label'>Telefone:</div>
                    <input 
                      type="tel"
                      id="phone" 
                      name="phone" 
                      className='email-input'
                      placeholder="(xx) xxxxx-xxxx"
                      value={formData.phone} 
                      onChange={handleInputChange}/>
                </div>
              </div> 
            </div>
            <div className='buttons-container'>
              <div className= 'login-button' >
                <button type="button" onClick={handleRedirectBack}>Voltar</button>
              </div>
              <div className= 'signup-button'>
                <button type="button" onClick={handleRegister}>Cadastrar</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPatient;
