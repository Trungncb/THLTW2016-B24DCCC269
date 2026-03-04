import React, { useState, useEffect } from 'react';
import { Card, InputNumber, Button, message, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const GuessNumber: React.FC = () => {
  const [target, setTarget] = useState<number>(0);
  const [guess, setGuess] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState<string>('');

  const startGame = () => {
    const rand = Math.floor(Math.random() * 100) + 1;
    setTarget(rand);
    setAttempts(0);
    setGuess(null);
    setFinished(false);
    setFeedback('');
  };

  useEffect(() => {
    startGame();
  }, []);

  const handleGuess = () => {
    if (guess === null) {
      message.warning('Vui lòng nhập dự đoán');
      return;
    }
    const next = attempts + 1;
    setAttempts(next);

    if (guess === target) {
      setFeedback('Chúc mừng! Bạn đã đoán đúng!');
      setFinished(true);
      return;
    }

    if (guess < target) {
      setFeedback('Bạn đoán quá thấp!');
    } else {
      setFeedback('Bạn đoán quá cao!');
    }

    if (next >= 10 && guess !== target) {
      setFeedback(`Bạn đã hết lượt! Số đúng là ${target}.`);
      setFinished(true);
    }
  };

  return (
    <Card style={{ maxWidth: 400, margin: '40px auto' }}>
      <Title level={3}>Game Đoán Số</Title>
      <Paragraph>Hãy đoán một số từ 1 đến 100. Bạn có 10 lượt.</Paragraph>
      <div style={{ marginBottom: 16 }}>
        <InputNumber
          min={1}
          max={100}
          value={guess === null ? undefined : guess}
          onChange={(val) => setGuess(val as number)}
          disabled={finished}
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleGuess} disabled={finished}>
          Đoán
        </Button>{' '}
        <Button onClick={startGame}>Chơi lại</Button>
      </div>
      <Paragraph>{feedback}</Paragraph>
      <Paragraph>Đã dùng: {attempts}/10</Paragraph>
    </Card>
  );
};

export default GuessNumber;
