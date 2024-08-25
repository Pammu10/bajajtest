"use client"

import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import styles from './Home.module.css';
import Select from 'react-select';
import { MultiValue } from 'react-select';

interface ResponseData {
  is_success: boolean;
  user_id: string;
  college_email: string;
  college_roll_number: string;
  numbers: string[];
  alphabets: string[];
  highest_lowercase: string[];
}

interface ParsedData {
  data: string[];
}

const options = [
  { value: 'Alphabets', label: 'Alphabets' },
  { value: 'Numbers', label: 'Numbers' },
  { value: 'Highest lowercase alphabet', label: 'Highest lowercase alphabet' },
];

export default function Home() {
  const [jsonInput, setJsonInput] = useState<string>('');
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<{ value: string; label: string }[]>([]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const parsedData: ParsedData = JSON.parse(jsonInput);
      if (!Array.isArray(parsedData.data)) {
        throw new Error('Invalid JSON format. The "data" field must be an array.');
      }

      const result = await axios.post<ResponseData>('https://bajajtest-mwte.onrender.com/bfhl', parsedData);
      setResponse(result.data);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
      setResponse(null);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setJsonInput(event.target.value);
  };

  const handleDropdownChange = (newValue: MultiValue<{ value: string; label: string }>,
    actionMeta: any) => {
      const selected = newValue as { value: string; label: string }[];
      setSelectedOptions(selected);
  };

  const renderResponseData = () => {
    if (!response) return null;

    const { alphabets, numbers, highest_lowercase } = response;
    const selectedValues = selectedOptions.map(option => option.value);

    return (
      <div className={styles.response}>
        <h2 className="text-xl font-semibold">Filtered Response Data</h2>
        {selectedValues.includes('Alphabets') && (
          <div>
            <h3 className="font-semibold">Alphabets:</h3>
            <pre>{JSON.stringify(alphabets)}</pre>
          </div>
        )}
        {selectedValues.includes('Numbers') && (
          <div>
            <h3 className="font-semibold">Numbers:</h3>
            <pre>{JSON.stringify(numbers)}</pre>
          </div>
        )}
        {selectedValues.includes('Highest lowercase alphabet') && (
          <div>
            <h3 className="font-semibold">Highest Lowercase Alphabet:</h3>
            <pre>{JSON.stringify(highest_lowercase)}</pre>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Submit JSON Data</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <textarea
          className={styles.textarea}
          value={jsonInput}
          onChange={handleChange}
          placeholder='Enter JSON here, e.g., {"data": ["A", "C", "z"]}'
        />
        <button type="submit" className={styles.button}>Submit</button>
      </form>
      <div className={styles.dropdowndiv}>
          <label className="block text-lg font-semibold mb-2">Select Data to Display:</label>
          <Select
            isMulti
            options={options}
            onChange={handleDropdownChange}
            value={selectedOptions}
            className={styles.dropdown}
          />
          
        </div>
      {response && (
        <div className={styles.dropdowndiv}>
        {renderResponseData()}
        </div>
      )}

      {error && (
        <div className={styles.error}>
          <h2 className="text-xl font-semibold">Error</h2>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
