import { useEffect, useState } from 'react';
import axios from 'axios';

const useGetCountries = () => {
    const [countries, setCountries] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("https://restcountries.com/v3.1/all");
                const sortedCountries = response.data.sort((a, b) => a.name.common.localeCompare(b.name.common));
                setCountries(sortedCountries);
            } catch (error) {
                console.error("Error fetching countries:", error);
            }
        };
    
        fetchData();
    }, []);

    return countries;
};

export default useGetCountries;
