export const cities = [
    // Cidades brasileiras principais
    { id: 1, name: 'São Paulo', country: 'Brazil', state: 'São Paulo', lat: -23.5505, lon: -46.6333 },
    { id: 2, name: 'Rio de Janeiro', country: 'Brazil', state: 'Rio de Janeiro', lat: -22.9068, lon: -43.1729 },
    { id: 3, name: 'Brasília', country: 'Brazil', state: 'Distrito Federal', lat: -15.7942, lon: -47.8822 },
    { id: 4, name: 'Salvador', country: 'Brazil', state: 'Bahia', lat: -12.9714, lon: -38.5014 },
    { id: 5, name: 'Fortaleza', country: 'Brazil', state: 'Ceará', lat: -3.7172, lon: -38.5433 },
    { id: 6, name: 'Belo Horizonte', country: 'Brazil', state: 'Minas Gerais', lat: -19.9167, lon: -43.9345 },
    { id: 7, name: 'Manaus', country: 'Brazil', state: 'Amazonas', lat: -3.1190, lon: -60.0217 },
    { id: 8, name: 'Curitiba', country: 'Brazil', state: 'Paraná', lat: -25.4284, lon: -49.2733 },
    { id: 9, name: 'Recife', country: 'Brazil', state: 'Pernambuco', lat: -8.0476, lon: -34.8770 },
    { id: 10, name: 'Porto Alegre', country: 'Brazil', state: 'Rio Grande do Sul', lat: -30.0346, lon: -51.2177 },
    { id: 11, name: 'Goiânia', country: 'Brazil', state: 'Goiás', lat: -16.6869, lon: -49.2648 },
    { id: 12, name: 'Belém', country: 'Brazil', state: 'Pará', lat: -1.4558, lon: -48.4902 },
    { id: 13, name: 'Guarulhos', country: 'Brazil', state: 'São Paulo', lat: -23.4538, lon: -46.5333 },
    { id: 14, name: 'Campinas', country: 'Brazil', state: 'São Paulo', lat: -22.9099, lon: -47.0626 },
    { id: 15, name: 'Nova Iguaçu', country: 'Brazil', state: 'Rio de Janeiro', lat: -22.7592, lon: -43.4511 },
    { id: 16, name: 'Maceió', country: 'Brazil', state: 'Alagoas', lat: -9.6498, lon: -35.7089 },
    { id: 17, name: 'São Luís', country: 'Brazil', state: 'Maranhão', lat: -2.5307, lon: -44.3068 },
    { id: 18, name: 'Duque de Caxias', country: 'Brazil', state: 'Rio de Janeiro', lat: -22.7856, lon: -43.3118 },
    { id: 19, name: 'Natal', country: 'Brazil', state: 'Rio Grande do Norte', lat: -5.7945, lon: -35.2110 },
    { id: 20, name: 'Florianópolis', country: 'Brazil', state: 'Santa Catarina', lat: -27.5949, lon: -48.5482 },

    // Algumas cidades internacionais populares
    { id: 21, name: 'New York', country: 'United States', state: 'New York', lat: 40.7128, lon: -74.0060 },
    { id: 22, name: 'London', country: 'United Kingdom', state: 'England', lat: 51.5074, lon: -0.1278 },
    { id: 23, name: 'Paris', country: 'France', state: 'Île-de-France', lat: 48.8566, lon: 2.3522 },
    { id: 24, name: 'Tokyo', country: 'Japan', state: 'Tokyo', lat: 35.6762, lon: 139.6503 },
    { id: 25, name: 'Sydney', country: 'Australia', state: 'New South Wales', lat: -33.8688, lon: 151.2093 },
    { id: 26, name: 'Berlin', country: 'Germany', state: 'Berlin', lat: 52.5200, lon: 13.4050 },
    { id: 27, name: 'Madrid', country: 'Spain', state: 'Madrid', lat: 40.4168, lon: -3.7038 },
    { id: 28, name: 'Rome', country: 'Italy', state: 'Lazio', lat: 41.9028, lon: 12.4964 },
    { id: 29, name: 'Buenos Aires', country: 'Argentina', state: 'Buenos Aires', lat: -34.6037, lon: -58.3816 },
    { id: 30, name: 'Mexico City', country: 'Mexico', state: 'Mexico City', lat: 19.4326, lon: -99.1332 }
  ];
 
  export const searchCities = (query) => {
    if (!query || query.trim() === '') {
      return cities;
    }
   
    const lowerQuery = query.toLowerCase().trim();
    return cities.filter(city =>
      city.name.toLowerCase().includes(lowerQuery) ||
      city.country.toLowerCase().includes(lowerQuery) ||
      city.state.toLowerCase().includes(lowerQuery)
    );
  };
 
  export const getCityById = (id) => {
    return cities.find(city => city.id === parseInt(id));
  };