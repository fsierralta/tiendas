
export default function PageError({children}: {children: React.ReactNode}){

    return(
        <div>
            
            <h1 className="text-2xl font-bold text-center mt-10">Page Error</h1>
            {children}
        </div>  

    )
}
