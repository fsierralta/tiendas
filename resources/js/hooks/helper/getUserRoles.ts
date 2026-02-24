export function getUserRoles(props: any): string[] {
    const { auth } = props;
    let crudroles:string[]=[];

    const { role_user } = auth;
   // console.log(role_user)
    let rolesname= role_user.map((role: any) => role.name);
    
    function crudRoles(role_user:any){
       const roles= role_user.map((role: any) => {
            if(role.create){
                crudroles.push('create')
            }
            if(role.read){
                crudroles.push('read')
            }
            if(role.update){
                crudroles.push('update')
            }
            if(role.delete){
                crudroles.push('delete')
            }
            
        }
        
    );

    }
   crudRoles(role_user)
   return [rolesname,crudroles]
    




}
