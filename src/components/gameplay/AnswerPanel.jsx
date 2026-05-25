import { useState } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import FormField from '../forms/FormField';
import FormStatus from '../forms/FormStatus';
import TextField from '../forms/TextField';

export default function AnswerPanel({ onSubmit, disabled = false }) {
  const [answer, setAnswer] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedAnswer = answer.trim();

    if (!trimmedAnswer) {
      setMessage('Type an answer before submitting.');
      return;
    }

    onSubmit?.(trimmedAnswer);
    setMessage('Answer submitted.');
    setAnswer('');
  };

  return (
    <Card eyebrow="Answer" title="Enter your response" description="Use the input below to submit the current prompt.">
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <FormField label="Your answer" htmlFor="game-answer">
          <TextField
            id="game-answer"
            name="answer"
            type="text"
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            placeholder="Type your answer"
            autoComplete="off"
            disabled={disabled}
          />
        </FormField>
        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={disabled}>
            Submit answer
          </Button>
          <Button type="button" variant="ghost" onClick={() => setAnswer('')} disabled={disabled}>
            Clear
          </Button>
        </div>
        <FormStatus>{message}</FormStatus>
      </form>
    </Card>
  );
}
