import Image from "next/image";

import "./styles.css";

// import spinnerIcon from "../../../public/icons/spinner.svg";
import spinnerIcon from "@/public/icons/spinner.svg";

const SpinnerLoader = () => {
  return (
    <div className="spinner__loader__wrapper">
      <div className="spinner__loader__image">
        <Image src={spinnerIcon} alt="spinner" height="300" width="300" />
      </div>
      <div>
        <span className="spinner__loader__message">Procesando</span>
      </div>
    </div>
  );
};

export default SpinnerLoader;
