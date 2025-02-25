'use client';

import { useState, FormEvent } from 'react';

export default function HomePage() {
  const [caster1, setCaster1] = useState('');
  const [caster2, setCaster2] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch('/api/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caster1, caster2 }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
      } else {
        setMessage(`Ошибка: ${data.error}`);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage('Ошибка запроса: ' + err.message);
      } else {
        setMessage('Неизвестная ошибка');
      }
    }
  }

  return (
    <div style={{ margin: 20, fontFamily: 'sans-serif' }}>
      <h1>Обновление Google Sheets</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <div style={{ marginBottom: 10 }}>
          <label style={{ display: 'inline-block', width: 100 }}>Кастер1:</label>
          <input
            type="text"
            value={caster1}
            onChange={(e) => setCaster1(e.target.value)}
            placeholder="Введите текст для кастера1"
            style={{ width: 300 }}
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label style={{ display: 'inline-block', width: 100 }}>Кастер2:</label>
          <input
            type="text"
            value={caster2}
            onChange={(e) => setCaster2(e.target.value)}
            placeholder="Введите текст для кастера2"
            style={{ width: 300 }}
          />
        </div>
        <button type="submit">Обновить</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
