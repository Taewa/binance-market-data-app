import { ReactNode } from "react";

const GradientBg = ({ children, className }: {children: ReactNode, className?: string}) => {
  return (
    <div className={`p-[1px] bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg ${className}`}>
      {children}
    </div>
  );
}

export default GradientBg;