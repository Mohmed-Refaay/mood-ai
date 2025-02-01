"use client";

import { Button, Input } from "@mui/joy";
import { useState } from "react";

export function AskAboutJorunals() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    setIsLoading(true);
    const response = await fetch("/api/ask", {
      method: "POST",
      body: JSON.stringify({ question }),
    });
    const data = await response.json();
    setAnswer(data.answer);
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Input
        value={question}
        disabled={isLoading}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask about your journals"
      />
      <Button type="submit" disabled={isLoading}>
        Ask
      </Button>
      {isLoading && <div>Loading...</div>}
      {answer && <div>{answer}</div>}
    </form>
  );
}
