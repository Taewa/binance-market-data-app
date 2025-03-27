export const cutByPage = (page: number, size: number): {from: number, to: number} => {
  const from = (page - 1) * size;
  const to = from + size;

  return  { from, to };
}

/**
 * Cut last zero
 * EX: "0.0004200" => "0.00042"
 * @param numStr number that is stringyfied 
 * @returns stringified number
 */
export const formatNumber = (numStr: string): string => {
  return numStr.replace(/\.?0+$/, '');
};

export const formatDate = (milliseconds: number): string => {
  if(!milliseconds) return '0';

  const date = new Date(milliseconds);
  return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
}