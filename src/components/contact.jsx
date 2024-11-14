import {useState} from "react";
import {v4 as uuidv4} from "uuid";

function Contact(){
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });

    //Estado para manejar el mensaje de exito despues de enviar el formulario
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e)=> {
        const {name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name] : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataToSend = {
            ...formData,
            sessionId: uuidv4(),
            timestamp: new Date().toISOString()
        };

        try{
            const response = await fetch('http://localhost:3001/messages', {
                method: POST,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend)
            });

            if(response.ok){
                setSuccessMessage('Gracias por tu mensaje. Hemos recibido tus comentarios.');

            setFormData({
                name: "",
                email: "",
                message: ""
                });
            }else{
                console.error("Error al guardar el mensaje");
            }
        }catch (error){
            console.error("Error de red:", error);
        }
    }

    return (
        //Contenedor del formulario de contacto
        <div className="p-6 bg-white rounded-lg shadow-md w-80 mx-auto mt-8">
            {/*Titulo del formulario*/}
            <h2 className="text-2xl font-bold text-center mb-4">Contacto</h2>

            {/*Mensaje de éxito*/}
            {successMessage && (
                <p className="text-green-500 text-center mb-4">{successMessage}</p>
            )}

            {/*Formulario de contacto*/}
            <form onSubmit={handleSubmit}>
                {/*Campo de Nombre*/}
                <div className="mb-4">
                    <label className="block font-medium mb-1">Nombre:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" required />
                </div>
                {/*Campo de Email*/}
                <div className="mb-4">
                    <label className="block font-medium mb-1">Correo electrónico:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" required />
                </div>
                {/*Campo de Mensaje*/}
                <div className="mb-4">
                    <label className="block font-medium mb-1">Mensaje:</label>
                    <textarea name="message" value={formData.message} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" rows="4" required></textarea>
                </div>
                {/*Boton de envio*/}
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">Enviar</button>
            </form>
        </div>
    )
}

export default Contact;