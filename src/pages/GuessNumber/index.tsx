import React, { useState, useEffect } from 'react';
import { Card, Button, Input, message, Divider, Statistic, Row, Col, Space, InputNumber, Tag } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import styles from './index.less';

const GuessNumber: React.FC = () => {
	const [secretNumber, setSecretNumber] = useState<number>(0);
	const [guess, setGuess] = useState<number | null>(null);
	const [attempts, setAttempts] = useState<number>(0);
	const [guessHistory, setGuessHistory] = useState<number[]>([]);
	const [gameStart, setGameStart] = useState<boolean>(false);
	const [gameWon, setGameWon] = useState<boolean>(false);
	const [highScore, setHighScore] = useState<number>(1000);

	useEffect(() => {
		const stored = localStorage.getItem('guessNumberHighScore');
		if (stored) {
			setHighScore(parseInt(stored));
		}
	}, []);

	const startGame = () => {
		const min = 1;
		const max = 100;
		const number = Math.floor(Math.random() * (max - min + 1)) + min;
		setSecretNumber(number);
		setGuess(null);
		setAttempts(0);
		setGuessHistory([]);
		setGameStart(true);
		setGameWon(false);
		message.info('🎮 Game started! Guess a number between 1 and 100');
	};

	const handleGuess = () => {
		if (guess === null) {
			message.warning('Please enter a number!');
			return;
		}

		if (guess < 1 || guess > 100) {
			message.warning('Number must be between 1 and 100!');
			return;
		}

		const newAttempts = attempts + 1;
		setAttempts(newAttempts);
		setGuessHistory([...guessHistory, guess]);

		if (guess === secretNumber) {
			setGameWon(true);
			message.success(`🎉 Correct! You guessed the number in ${newAttempts} attempts!`);
			if (newAttempts < highScore) {
				setHighScore(newAttempts);
				localStorage.setItem('guessNumberHighScore', newAttempts.toString());
				message.success(`🏆 New high score: ${newAttempts} attempts!`);
			}
		} else if (guess < secretNumber) {
			message.info(`❌ Too low! Try a higher number. (Attempts: ${newAttempts})`);
		} else {
			message.info(`❌ Too high! Try a lower number. (Attempts: ${newAttempts})`);
		}

		setGuess(null);
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleGuess();
		}
	};

	return (
		<div style={{ padding: '24px' }}>
			<Card title="🎯 Guess the Number Game" className={styles.gameCard}>
				{!gameStart ? (
					<div style={{ textAlign: 'center', padding: '40px 0' }}>
						<p style={{ fontSize: '18px', marginBottom: '20px' }}>
							Try to guess a random number between 1 and 100!
						</p>
						<Button type="primary" size="large" onClick={startGame}>
							Start Game
						</Button>
					</div>
				) : (
					<div>
						<Row gutter={16} style={{ marginBottom: '24px' }}>
							<Col span={8}>
								<Statistic
									title="Attempts"
									value={attempts}
									suffix="tries"
								/>
							</Col>
							<Col span={8}>
								<Statistic
									title="High Score"
									value={highScore}
									suffix="best"
								/>
							</Col>
							<Col span={8}>
								<Statistic
									title="Status"
									value={gameWon ? '✅ Won!' : '🎮 Playing'}
									valueStyle={{ color: gameWon ? '#52c41a' : '#1890ff' }}
								/>
							</Col>
						</Row>

						<Divider />

						<Space direction="vertical" style={{ width: '100%' }} size="large">
							<div>
								<label style={{ marginRight: '10px' }}>Enter your guess:</label>
								<InputNumber
									min={1}
									max={100}
									value={guess}
									onChange={(val) => setGuess(val)}
									onPressEnter={handleKeyPress}
									placeholder="1 - 100"
									disabled={gameWon}
									style={{ width: '150px', marginRight: '10px' }}
								/>
								<Button
									type="primary"
									onClick={handleGuess}
									disabled={gameWon}
								>
									Guess
								</Button>
							</div>

							{gameWon && (
								<div>
									<Button
										type="primary"
										icon={<ReloadOutlined />}
										onClick={startGame}
									>
										Play Again
									</Button>
								</div>
							)}
						</Space>

						<Divider />

						<div>
							<h3>Guess History:</h3>
							{guessHistory.length === 0 ? (
								<p>No guesses yet</p>
							) : (
								<div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
									{guessHistory.map((num, index) => (
										<Tag key={index} color={num === secretNumber ? 'green' : 'blue'}>
											{num}
										</Tag>
									))}
								</div>
							)}
						</div>

						{gameWon && (
							<div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: '4px' }}>
								<h3>🎉 Congratulations!</h3>
								<p>You guessed the correct number <strong>{secretNumber}</strong> in <strong>{attempts}</strong> attempts!</p>
							</div>
						)}
					</div>
				)}
			</Card>
		</div>
	);
};

export default GuessNumber;
