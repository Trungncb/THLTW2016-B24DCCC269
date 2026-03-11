import React, { useState } from 'react';
import { Button, Card, List, Row, Col, Statistic, Space } from 'antd';

const choices = ['Kéo', 'Búa', 'Bao'];
const emoji = { 'Kéo': '✌️', 'Búa': '✊', 'Bao': '✋' };

const RockPaperScissors: React.FC = () => {
    const [playerChoice, setPlayerChoice] = useState<string | null>(null);
    const [computerChoice, setComputerChoice] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const [history, setHistory] = useState<
        { player: string; computer: string; result: string }[]
    >([]);
    const [scores, setScores] = useState({ win: 0, lose: 0, draw: 0 });

    const handlePlay = (choice: string) => {
        const computerRandomChoice =
            choices[Math.floor(Math.random() * choices.length)];
        setPlayerChoice(choice);
        setComputerChoice(computerRandomChoice);

        let gameResult = '';
        if (choice === computerRandomChoice) {
            gameResult = 'Hòa';
            setScores(p => ({ ...p, draw: p.draw + 1 }));
        } else if (
            (choice === 'Kéo' && computerRandomChoice === 'Bao') ||
            (choice === 'Búa' && computerRandomChoice === 'Kéo') ||
            (choice === 'Bao' && computerRandomChoice === 'Búa')
        ) {
            gameResult = 'Bạn thắng!';
            setScores(p => ({ ...p, win: p.win + 1 }));
        } else {
            gameResult = 'Máy tính thắng!';
            setScores(p => ({ ...p, lose: p.lose + 1 }));
        }

        setResult(gameResult);
        setHistory([
            { player: choice, computer: computerRandomChoice, result: gameResult },
            ...history.slice(0, 9)
        ]);
    };

    const handleReset = () => {
        setPlayerChoice(null);
        setComputerChoice(null);
        setResult(null);
        setHistory([]);
        setScores({ win: 0, lose: 0, draw: 0 });
    };

    return (
        <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h1>Kéo, Búa, Bao</h1>
            </div>
            
            {/* Nút chơi */}
            <Card style={{ marginBottom: '20px' }}>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '20px' }}>Chọn của bạn:</p>
                    <Space size="large">
                        {choices.map((choice) => (
                            <Button
                                key={choice}
                                size="large"
                                onClick={() => handlePlay(choice)}
                                type={playerChoice === choice ? 'primary' : 'default'}
                                style={{ minWidth: '120px', height: '80px', fontSize: '18px' }}
                            >
                                {emoji[choice as keyof typeof emoji]}
                                <br />
                                {choice}
                            </Button>
                        ))}
                    </Space>
                </div>
            </Card>

            {/* Kết quả */}
            {result && (
                <Card style={{ marginBottom: '20px' }}>
                    <Row gutter={16} justify="center">
                        <Col md={6} xs={24} style={{ textAlign: 'center', marginBottom: '10px' }}>
                            <p style={{ fontSize: '12px', color: '#00a' }}>Bạn chọn</p>
                            <p style={{ fontSize: '36px' }}>{emoji[playerChoice as keyof typeof emoji]}</p>
                            <p style={{ fontWeight: '500' }}>{playerChoice}</p>
                        </Col>
                        <Col md={6} xs={24} style={{ textAlign: 'center', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <p style={{ fontSize: '20px', fontWeight: '500', color: '#1890ff' }}>VS</p>
                        </Col>
                        <Col md={6} xs={24} style={{ textAlign: 'center', marginBottom: '10px' }}>
                            <p style={{ fontSize: '12px', color: '#00a' }}>Máy tính</p>
                            <p style={{ fontSize: '36px' }}>{emoji[computerChoice as keyof typeof emoji]}</p>
                            <p style={{ fontWeight: '500' }}>{computerChoice}</p>
                        </Col>
                    </Row>
                    <p style={{ textAlign: 'center', fontSize: '18px', fontWeight: '600', marginTop: '20px', color: result.includes('thắng') ? '#52c41a' : result.includes('Hòa') ? '#faad14' : '#ff4d4f' }}>
                        {result}
                    </p>
                </Card>
            )}

            {/* Thống kê */}
            <Row gutter={[16, 16]} style={{ marginBottom: '20px' }} justify="center">
                <Col md={6} xs={8}>
                    <Card style={{ textAlign: 'center' }}>
                        <Statistic title="Thắng" value={scores.win} valueStyle={{ color: '#52c41a', fontSize: '24px' }} />
                    </Card>
                </Col>
                <Col md={6} xs={8}>
                    <Card style={{ textAlign: 'center' }}>
                        <Statistic title="Hòa" value={scores.draw} valueStyle={{ color: '#faad14', fontSize: '24px' }} />
                    </Card>
                </Col>
                <Col md={6} xs={8}>
                    <Card style={{ textAlign: 'center' }}>
                        <Statistic title="Thua" value={scores.lose} valueStyle={{ color: '#ff4d4f', fontSize: '24px' }} />
                    </Card>
                </Col>
            </Row>

            {/* Nút reset */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <Button onClick={handleReset} danger>
                    Reset Game
                </Button>
            </div>

            {/* Lịch sử */}
            {history.length > 0 && (
                <Card title="Lịch sử trận đấu">
                    <List
                        dataSource={history}
                        renderItem={(item, index) => (
                            <List.Item>
                                <span>Ván {index + 1}: {item.player} {emoji[item.player as keyof typeof emoji]} vs {emoji[item.computer as keyof typeof emoji]} {item.computer} → <strong>{item.result}</strong></span>
                            </List.Item>
                        )}
                    />
                </Card>
            )}
        </div>
    );
};

export default RockPaperScissors;