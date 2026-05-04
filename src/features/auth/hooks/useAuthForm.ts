import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';

export const useLoginForm = () => {
  const { login, skip } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    if (!email || !password) {
      setError('Please enter your credentials.');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return { email, password, setEmail, setPassword, loading, error, submit, skip };
};

export const useSignupForm = () => {
  const { signup, skip } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      await signup(name, email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create account.');
    } finally {
      setLoading(false);
    }
  };

  return {
    name, email, password,
    setName, setEmail, setPassword,
    loading, error, submit, skip,
  };
};