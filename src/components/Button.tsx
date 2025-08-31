import Image from "next/image"

type ButtonProps = {
    type: 'button' | 'submit'; 
    title: string;
    icon?: string;
    variant: 'btn_dark_blue'

}

const Button = ({type, title, icon, variant}: ButtonProps) => {
  return (
    <button
    className={`flex justify-center items-center gap-3 rounded-full border px-4 py-2 ${variant}`}
    type={type}
    >

    {icon && <Image src={icon} alt={title} width={24} height={24} />}

    <label className="font-bold text-base whitespace-nowrap cursor-pointer">
    {title}
    </label>
    </button>
  )
}

export default Button