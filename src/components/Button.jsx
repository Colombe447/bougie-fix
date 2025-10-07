export function Button({variant='solid', className='', ...props}){
  const base = variant==='ghost' ? 'btn-ghost' : 'btn'
  return <button className={base + ' ' + className} {...props} />
}