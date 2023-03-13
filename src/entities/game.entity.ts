import { Column, Entity, JoinColumn, ManyToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Player } from './player.entity';
import { Question } from './question.entity';
import { AnswerStatusesType } from './answer.entity';
import { ForbiddenExceptionMY } from '../main/helpers/My-HttpExceptionFilter';

export enum GameStatusesType {
  PendingSecondPlayer = 'PendingSecondPlayer',
  Active = 'Active',
  Finished = 'Finished',
}

@Entity()
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    type: 'enum',
    enum: GameStatusesType,
    default: GameStatusesType.PendingSecondPlayer,
  })
  status: GameStatusesType;

  @Column({ type: 'timestamptz', default: null })
  pairCreatedDate: Date; //Date when first player initialized the pair
  @Column({ type: 'timestamptz', default: null })
  startGameDate: Date; //Game starts immediately after second player connection to this pair
  @Column({ type: 'timestamptz', default: null })
  finishGameDate: Date; //Game finishes immediately after both players have answered all the questions

  @Column({ type: 'timestamptz', default: null })
  finishedOnePlayer: Date; //Finished one player, for 10s

  @Column({ type: 'uuid' })
  firstPlayerId: string;
  @Column({ type: 'uuid', default: null })
  secondPlayerId: string;

  @OneToOne(() => Player, { cascade: true, eager: true, onUpdate: 'CASCADE' }) // cascade: true,
  @JoinColumn()
  firstPlayerProgress: Player;

  @OneToOne(() => Player, { cascade: true, eager: true, onUpdate: 'CASCADE' }) // cascade: true,
  @JoinColumn()
  secondPlayerProgress: Player;

  @ManyToMany(() => Question, (q) => q.games)
  questions: Question[];

  constructor(questions: Question[], userId: string) {
    this.questions = questions;
    this.firstPlayerId = userId;
  }

  static createGame(questions: Question[], userId: string): Game {
    return new Game(questions, userId);
  }

  //getter
  getIdFirstPlayer() {
    return this.firstPlayerId;
  }

  getLastAnswerFirstPlayer() {
    return this.firstPlayerProgress.answers.reverse()[0];
  }

  getLastAnswerSecondPlayer() {
    return this.secondPlayerProgress.answers.reverse()[0];
  }

  //check
  isPlayerParticipate(userId: string) {
    if (this.firstPlayerId !== userId && this.secondPlayerId !== userId) return true;
  }

  //connection
  addFirstPlayer(player: Player) {
    this.firstPlayerProgress = player;
    this.pairCreatedDate = new Date();
    this.status = GameStatusesType.PendingSecondPlayer;
  }

  addSecondPlayer(player: Player, userId: string) {
    this.secondPlayerProgress = player;
    this.startGameDate = new Date();
    this.status = GameStatusesType.Active;
    this.secondPlayerId = userId;
  }

  //game
  startGame(userId: string, answer: string) {
    if (this.isPlayerFinished(userId)) throw new ForbiddenExceptionMY('Current user is already participating in active pair');
    if (this.firstPlayerId === userId) {
      this.firstStageGame(this.firstPlayerProgress, answer);
      if (this.firstPlayerProgress.answers.length === this.questions.length) {
        this.finishedPlayer();
      }
      return;
    }
    if (this.secondPlayerId === userId) {
      this.firstStageGame(this.secondPlayerProgress, answer);
      if (this.secondPlayerProgress.answers.length === this.questions.length) {
        this.finishedPlayer();
      }
      return;
    }
  }

  private isPlayerFinished(userId: string) {
    if (this.firstPlayerId === userId) {
      return this.questions.length === this.firstPlayerProgress.answers.length;
    }
    if (this.secondPlayerId === userId) {
      return this.questions.length === this.secondPlayerProgress.answers.length;
    }
  }

  private firstStageGame(player: Player, answer: string) {
    let filteredQuestions = this.questions.sort((a, b) => Number(b.updatedAt) - Number(a.updatedAt));
    const currentQuestion = filteredQuestions[player.answers.length];
    if (!this.isAnswerCorrect(answer, currentQuestion)) {
      const instanceAnswer = Player.createAnswer(answer, currentQuestion.id, player);
      instanceAnswer.inCorrectAnswer();
      player.answers.push(instanceAnswer);
      if (this.isGameFinished()) {
        this.secondStageGame();
      }
      return;
    }
    player.score += 1;
    const instanceAnswer = Player.createAnswer(answer, currentQuestion.id, player);
    instanceAnswer.correctAnswer();
    player.answers.push(instanceAnswer);
    if (this.isGameFinished()) {
      this.secondStageGame();
    }
    return;
  }

  private isAnswerCorrect(answer: string, question: Question) {
    if (question.correctAnswers.find((e) => e === answer)) return true;
  }

  private isGameFinished() {
    if (
      this.questions.length === this.firstPlayerProgress.answers.length &&
      this.questions.length === this.secondPlayerProgress.answers.length
    )
      return true;
  }

  private secondStageGame() {
    if (this.isGameFinished()) {
      this.addBonusPointPlayer();
      this.thirdStageGame();
      this.finishGame();
      return;
    }
    return;
  }

  private thirdStageGame() {
    if (this.firstPlayerProgress.score > this.secondPlayerProgress.score) {
      this.firstPlayerProgress.winScore += 1;
      this.firstPlayerProgress.statusesPlayer = true;
      this.secondPlayerProgress.lossScore += 1;
      this.secondPlayerProgress.statusesPlayer = true;
      return;
    }
    if (this.firstPlayerProgress.score < this.secondPlayerProgress.score) {
      this.firstPlayerProgress.lossScore += 1;
      this.firstPlayerProgress.statusesPlayer = true;
      this.secondPlayerProgress.winScore += 1;
      this.secondPlayerProgress.statusesPlayer = true;
      return;
    }
    if (this.firstPlayerProgress.score === this.secondPlayerProgress.score) {
      this.firstPlayerProgress.drawScore += 1;
      this.firstPlayerProgress.statusesPlayer = true;
      this.secondPlayerProgress.drawScore += 1;
      this.secondPlayerProgress.statusesPlayer = true;
      return;
    }
  }

  private finishGame() {
    this.status = GameStatusesType.Finished;
    this.finishGameDate = new Date();
  }

  private addBonusPointPlayer() {
    const successAnswersFirstPlayer = this.firstPlayerProgress.answers.filter(
      (e) => e.answerStatus === AnswerStatusesType.Correct,
    );
    const successAnswersSecondPlayer = this.secondPlayerProgress.answers.filter(
      (e) => e.answerStatus === AnswerStatusesType.Correct,
    );
    const answersFirstPlayer = this.firstPlayerProgress.answers.sort((a, b) => Number(a.addedAt) - Number(b.addedAt));
    const answersSecondPlayer = this.secondPlayerProgress.answers.sort((a, b) => Number(a.addedAt) - Number(b.addedAt));
    if (successAnswersFirstPlayer.length >= 1 && answersFirstPlayer[4].addedAt < answersSecondPlayer[4].addedAt) {
      this.firstPlayerProgress.score += 1;
      return;
    }
    if (successAnswersSecondPlayer.length >= 1 && answersFirstPlayer[4].addedAt > answersSecondPlayer[4].addedAt) {
      this.secondPlayerProgress.score += 1;
      return;
    }
    return;
  }

  private finishedPlayer() {
    this.finishedOnePlayer = new Date();
  }

  //forced game
  forcedFinishGame() {
    this.thirdStageGame();
    this.addBonusPointPlayerForForcedWithZeroAnswers();
  }

  private addBonusPointPlayerForForcedWithZeroAnswers() {
    if (this.firstPlayerProgress.answers.length === 0 || this.secondPlayerProgress.answers.length === 0) {
      if (this.firstPlayerProgress.answers.length === this.questions.length) {
        // console.log('-f--with zero');
        this.firstPlayerProgress.score += 1;
        this.finishGame();
        return;
      }
      if (this.secondPlayerProgress.answers.length === this.questions.length) {
        // console.log('-s--with zero');
        this.secondPlayerProgress.score += 1;
        this.finishGame();
        return;
      }
    }
    this.addBonusPointPlayerForForced();
  }

  private addBonusPointPlayerForForced() {
    const successAnswersFirstPlayer = this.firstPlayerProgress.answers.filter(
      (e) => e.answerStatus === AnswerStatusesType.Correct,
    );
    const successAnswersSecondPlayer = this.secondPlayerProgress.answers.filter(
      (e) => e.answerStatus === AnswerStatusesType.Correct,
    );
    if (this.firstPlayerProgress.answers.length === this.questions.length && successAnswersFirstPlayer.length >= 1) {
      // console.log('-f--add point');
      this.firstPlayerProgress.score += 1;
      this.finishGame();
      return;
    }
    if (this.secondPlayerProgress.answers.length === this.questions.length && successAnswersSecondPlayer.length >= 1) {
      // console.log('-s--with zero');
      this.secondPlayerProgress.score += 1;
      this.finishGame();
      return;
    }
    // console.log('---less finish');
    this.finishGame();
    return;
  }

  //helps
  unAnsweredQuestion() {
    if (this.firstPlayerProgress.answers.length === this.questions.length) {
      const answers = this.secondPlayerProgress.answers;
      const question = this.questions;
      const unAnsweredQuestions = question.filter((item1) => {
        return !answers.find((item2) => item2.questionId === item1.id);
      });
      const count = unAnsweredQuestions.length;
      let instanceUnAnswers = [];
      for (let i = 1; i <= count; i++) {
        const numberQuestionSecondPlayer = unAnsweredQuestions[i - 1];
        const instanceAnswer = Player.createAnswer('finishedGame', numberQuestionSecondPlayer.id, this.secondPlayerProgress);
        instanceUnAnswers.push(instanceAnswer);
      }
      return instanceUnAnswers;
    }
    //for second player
    if (this.secondPlayerProgress.answers.length === this.questions.length) {
      const answers = this.firstPlayerProgress.answers;
      const question = this.questions;
      const unAnsweredQuestions = question.filter((item1) => {
        return !answers.find((item2) => item2.questionId === item1.id);
      });
      const count = unAnsweredQuestions.length;
      let instanceUnAnswers = [];
      for (let i = 1; i <= count; i++) {
        const numberQuestionSecondPlayer = unAnsweredQuestions[i - 1];
        const instanceAnswer = Player.createAnswer('finishedGame', numberQuestionSecondPlayer.id, this.firstPlayerProgress);
        instanceUnAnswers.push(instanceAnswer);
      }
      return instanceUnAnswers;
    }
  }
}
