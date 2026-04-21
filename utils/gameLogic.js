export function createGame(width, height, difficulty = "medium") {
  const aiSpeed = { easy: 2, medium: 4, hard: 6 };

  return {
    playerScore: 0,
    aiScore: 0,
    gameOver: false,

    player: { x: 10, y: height / 2 - 50, w: 10, h: 100 },
    ai: { x: width - 20, y: height / 2 - 50, w: 10, h: 100, speed: aiSpeed[difficulty] },

    ball: { x: width / 2, y: height / 2, size: 10, dx: 5, dy: 3 },

    width,
    height
  };
}

export function updateGame(game, input) {
  if (game.gameOver) return;

  const { player, ai, ball, width, height } = game;

  // 🎮 Player control
  player.y = input.y - player.h / 2;
  player.y = Math.max(0, Math.min(height - player.h, player.y));

  // 🤖 AI (smarter + imperfect)
  const target = ball.y - ai.h / 2;
  ai.y += (target - ai.y) * 0.08 + (Math.random() - 0.5) * 2;

  // ⚡ Ball movement
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Wall bounce
  if (ball.y <= 0 || ball.y >= height) ball.dy *= -1;

  // 🎯 Player hit (angle control)
  if (
    ball.x <= player.x + player.w &&
    ball.y > player.y &&
    ball.y < player.y + player.h
  ) {
    const hitPos = (ball.y - player.y) / player.h;
    ball.dy = (hitPos - 0.5) * 10;
    ball.dx *= -1.1;
  }

  // 🎯 AI hit
  if (
    ball.x + ball.size >= ai.x &&
    ball.y > ai.y &&
    ball.y < ai.y + ai.h
  ) {
    const hitPos = (ball.y - ai.y) / ai.h;
    ball.dy = (hitPos - 0.5) * 10;
    ball.dx *= -1.1;
  }

  // Score
  if (ball.x < 0) {
    game.aiScore++;
    reset(game);
  }

  if (ball.x > width) {
    game.playerScore++;
    reset(game);
  }

  if (game.playerScore >= 5 || game.aiScore >= 5) {
    game.gameOver = true;
  }
}

function reset(game) {
  game.ball.x = game.width / 2;
  game.ball.y = game.height / 2;
  game.ball.dx = 5 * (Math.random() > 0.5 ? 1 : -1);
  game.ball.dy = 3;
}