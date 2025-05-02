const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      // Submission logic here
    } catch (error: unknown) {
      console.error(error);
    }
  };