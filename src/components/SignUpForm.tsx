import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "../firebase";

export const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const auth = getAuth(app);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;

        window.location.href = "/backoffice";
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  };

  return (
    <form
      onSubmit={(e) => handleLogin(e)}
      className="flex w-96 flex-col items-center gap-4"
    >
      <h1 className="mb-4 text-3xl font-medium text-primary">Criar Conta</h1>

      <label className="flex w-full flex-col gap-1" htmlFor="username">
        <span className="font-medium">E-mail</span>
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
          id="email"
          name="email"
          type="email"
          className="rounded-md border border-gray-300 p-2"
        />
      </label>

      <label className="flex w-full flex-col gap-1" htmlFor="password">
        <span className="font-medium">Palavra-passe</span>
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
          id="password"
          name="password"
          type="password"
          className="rounded-md border border-gray-300 p-2"
        />
      </label>

      <button className="mt-2 w-full rounded-md bg-primary py-2.5 text-white">
        Entrar
      </button>

      <a href="/backoffice/signup" className="text-primary">
        Não tem conta? Registe-se
      </a>
    </form>
  );
};
