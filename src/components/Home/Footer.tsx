import { Mail } from "@components/Icons/Mail";
import { WhatsApp } from "@components/Icons/WhatsApp";
import { InstagramLogoIcon } from "@radix-ui/react-icons";
import { Link } from "react-router";

function Footer() {
  return (
    <div className="bg-black py-12 px-6">
      <div className="flex justify-center items-center gap-4 mb-12">
        <img
          src="demi-masa-logo.png"
          alt="Logo Aplikasi Demi Masa"
          className="w-12"
        />

        <h3 className="text-white font-bold text-xl">Demi Masa</h3>
      </div>

      <h3 className="text-white font-bold text-lg mb-2">Hubungi Kami</h3>
      <ul className="flex flex-col">
        <li>
          <Link
            to="mailto:demimasa@gmail.com"
            className="text-[#C2C2C2] text-sm flex items-center gap-3 py-2 hover:underline"
          >
            <Mail className="fill-[#C2C2C2] w-5 h-5" />
            demimasa@gmail.com
          </Link>
        </li>
        <li>
          <Link
            to="https://wa.me/6282349235756"
            target="_blank"
            rel="noopener"
            className="text-[#C2C2C2] text-sm flex items-center gap-3 py-2 hover:underline"
          >
            <WhatsApp className="fill-[#C2C2C2] w-5 h-5" />
            wa.me/082349235756
          </Link>
        </li>
        <li>
          <Link
            to="https://www.instagram.com/"
            target="_blank"
            rel="noopener"
            className="text-[#C2C2C2] text-sm flex items-center gap-3 py-2 hover:underline"
          >
            <InstagramLogoIcon className="text-[#C2C2C2] w-5 h-5" />
            instagram.com/demimasa
          </Link>
        </li>
      </ul>

      <hr className="border-white my-8" />
      <p className="text-white text-center">
        &copy; {new Date().getFullYear()} Demi Masa. All Rights Reserved
      </p>
    </div>
  );
}

export { Footer };
