type Props = {
  name: string;
  picture: string;
};

const Button = ({ name, picture }: Props) => {
  return <button className="flex items-center">This is a button</button>;
};

export default Button;
