// TicketForm.js
import { useState } from "react";

const Tickets = () => {
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Envoyer le message à l'administrateur (implémenter la logique ici)
    console.log("Message sent:", message);
    // Réinitialiser le formulaire
    setMessage("");
  };

  return (
    <div className="w-full h-full bg-gray-100 p-8">
      <h1 className="text-3xl font-semibold text-[#673AB7] font-montserrat mt-8">
        Contact Administrator
      </h1>
      <form onSubmit={handleSubmit} className="mt-5">
        <textarea
          value={message}
          onChange={handleChange}
          className="w-full h-40 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-[#673AB7]"
          placeholder="Write your message here..."
          required
        ></textarea>
        <button
          type="submit"
          className="bg-[#673AB7] text-white px-4 py-2 rounded-md mt-3 hover:bg-purple-700 transition duration-300"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Tickets;
