/* eslint-disable react/jsx-props-no-spreading */
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function RegistrationPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    try {
      axios
        .post(`${import.meta.env.VITE_BACKEND_URL}/api/user`, data)
        .then((res) => toast.success(res.data.message));
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="flex flex-col items-center gap-4 mt-8 h-screen">
      <h1 className="text-dkGreen dark:text-sand text-3xl text-center font-lexend">
        Inscription
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="shadow font-commi flex flex-col items-center gap-2 text-green dark:text-slate-800 text-2xl bg-sand p-6 rounded-md bg-opacity-80"
      >
        <label htmlFor="pseudo">Pseudo :</label>
        <input
          type="text"
          name="pseudo"
          className="rounded-md pl-2 bg-slate-200"
          {...register("pseudo", {
            required: "Ce champs est obligatoire",
            minLength: {
              value: 4,
              message: "Votre pseudo doit contenir au minimum 4 caractères",
            },
          })}
        />
        {errors.pseudo && (
          <p
            role="alert"
            className="bg-red-600 text-beige text-sm px-1 py-0.5 rounded-md"
          >
            {errors.pseudo?.message}
          </p>
        )}
        <label htmlFor="email">Email :</label>
        <input
          type="email"
          name="email"
          className="rounded-md bg-slate-200 pl-2"
          {...register("email", {
            required: "Ce champs est obligatoire",
            pattern: {
              value: /\b[\w.-]+@[\w.-]+\.\w{2,4}\b/,
              message:
                "Votre email n'a pas la bonne syntaxe, ex: johndoe@doe.fr",
            },
          })}
        />
        {errors.email && (
          <p
            role="alert"
            className="bg-red-600 text-beige text-sm px-1 py-0.5 rounded-md"
          >
            {errors.email?.message}
          </p>
        )}
        <label htmlFor="confirm-email">Confirmer l'email :</label>
        <input
          type="email"
          name="confirm-email"
          className="rounded-md bg-slate-200 pl-2"
          {...register("confirmEmail", {
            required: "Vous devez confirmer votre email",
            validate: (value) =>
              value === watch("email") || "Emails non identiques",
          })}
        />
        {errors.confirmEmail && (
          <p
            role="alert"
            className="bg-red-600 text-beige text-sm px-1 py-0.5 rounded-md"
          >
            {errors.confirmEmail?.message}
          </p>
        )}
        <label htmlFor="password">Mot de passe :</label>
        <input
          type="password"
          name="password"
          className="rounded-md bg-slate-200 pl-2"
          {...register("password", {
            required: "Ce champs est obligatoire",
            pattern: {
              value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
              message:
                "Votre mot de passe doit contenir au moins 8 caractères dont une majuscule, une minuscule, one number et un caractère spécial",
            },
          })}
        />
        {errors.password && (
          <p
            role="alert"
            className="bg-red-600 text-beige text-sm px-1 py-0.5 rounded-md"
          >
            {errors.password?.message}
          </p>
        )}
        <label htmlFor="confirm-password">Confirmez le mot de passe :</label>
        <input
          type="password"
          name="confirm-password"
          className="rounded-md bg-slate-200 pl-2"
          {...register("confirmPassword", {
            required: "Vous devez confirmer votre mot de passe",
            validate: (value) =>
              value === watch("password") || "Mots de passe non identiques",
          })}
        />
        {errors.confirmPassword && (
          <p
            role="alert"
            className="bg-red-600 text-beige text-sm px-1 py-0.5 rounded-md"
          >
            {errors.confirmPassword?.message}
          </p>
        )}
        <button
          type="submit"
          className="bg-green text-sand dark:bg-slate-700 font-bold active:bg-dkGreen shadow px-2 py-1 mt-4 rounded-md"
        >
          Créer mon compte
        </button>
      </form>
    </section>
  );
}
