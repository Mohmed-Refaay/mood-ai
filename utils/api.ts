const createUrl = (path: string) => {
  return window.location.origin + path;
};

export async function createJournalAPI(content: string) {
  const response = await fetch(createUrl("/api/journal"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });

  if (response.ok) {
    const data = await response.json();
    return data.data;
  }
}
