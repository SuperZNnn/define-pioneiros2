export const getIdade = (nascimento: Date) => {
    const bday = nascimento;
    const birthDate = new Date(bday);
    const currentDate = new Date();
    
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    
    const isBirthdayPassed = 
        currentDate.getMonth() > birthDate.getMonth() || 
        (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() >= birthDate.getDate());
    
    if (!isBirthdayPassed) {
        age--
    }

    return age
}