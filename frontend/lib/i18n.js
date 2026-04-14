// Internationalization system
export const translations = {
  en: {
    // Navigation
    nav: {
      home: 'Home',
      about: 'About',
      skills: 'Skills',
      projects: 'Projects',
      contact: 'Contact'
    },
    // Hero section
    hero: {
      greeting: 'Hello, I\'m',
      title: 'Front-End Developer',
      description: 'Creating beautiful and functional web experiences',
      cta: 'Get In Touch',
      learnMore: 'Learn More'
    },
    // About section
    about: {
      title: 'About Me',
      description: 'Passionate developer with expertise in modern web technologies',
      skillsHeading: 'My Skills',
      experienceHeading: 'Experience'
    },
    // Skills section
    skills: {
      title: 'Technical Skills',
      categories: {
        frontend: 'Frontend',
        backend: 'Backend',
        tools: 'Tools'
      }
    },
    // Projects section
    projects: {
      title: 'My Projects',
      viewProject: 'View Project',
      sourceCode: 'Source Code',
      technologies: 'Technologies'
    },
    // Contact section
    contact: {
      title: 'Get In Touch',
      subtitle: 'Let\'s work together',
      name: 'Name',
      email: 'Email',
      message: 'Message',
      send: 'Send Message',
      success: 'Message sent successfully!',
      error: 'Failed to send message'
    },
    // Common
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      retry: 'Retry',
      close: 'Close'
    }
  },
  am: {
    // Navigation
    nav: {
      home: 'Home',
      about: 'About',
      skills: 'Skills',
      projects: 'Projects',
      contact: 'Contact'
    },
    // Hero section
    hero: {
      greeting: 'Hello, I\'m',
      title: 'Front-End Developer',
      description: 'Creating beautiful and functional web experiences',
      cta: 'Get In Touch',
      learnMore: 'Learn More'
    },
    // About section
    about: {
      title: 'About Me',
      description: 'Passionate developer with expertise in modern web technologies',
      skillsHeading: 'My Skills',
      experienceHeading: 'Experience'
    },
    // Skills section
    skills: {
      title: 'Technical Skills',
      categories: {
        frontend: 'Frontend',
        backend: 'Backend',
        tools: 'Tools'
      }
    },
    // Projects section
    projects: {
      title: 'My Projects',
      viewProject: 'View Project',
      sourceCode: 'Source Code',
      technologies: 'Technologies'
    },
    // Contact section
    contact: {
      title: 'Get In Touch',
      subtitle: 'Let\'s work together',
      name: 'Name',
      email: 'Email',
      message: 'Message',
      send: 'Send Message',
      success: 'Message sent successfully!',
      error: 'Failed to send message'
    },
    // Common
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      retry: 'Retry',
      close: 'Close'
    }
  },
  es: {
    // Navigation
    nav: {
      home: 'Inicio',
      about: 'Acerca de',
      skills: 'Habilidades',
      projects: 'Proyectos',
      contact: 'Contacto'
    },
    // Hero section
    hero: {
      greeting: 'Hola, soy',
      title: 'Desarrollador Front-End',
      description: 'Creando experiencias web hermosas y funcionales',
      cta: 'Contáctame',
      learnMore: 'Saber más'
    },
    // About section
    about: {
      title: 'Acerca de mí',
      description: 'Desarrollador apasionado con experiencia en tecnologías web modernas',
      skillsHeading: 'Mis habilidades',
      experienceHeading: 'Experiencia'
    },
    // Skills section
    skills: {
      title: 'Habilidades Técnicas',
      categories: {
        frontend: 'Frontend',
        backend: 'Backend',
        tools: 'Herramientas'
      }
    },
    // Projects section
    projects: {
      title: 'Mis Proyectos',
      viewProject: 'Ver Proyecto',
      sourceCode: 'Código Fuente',
      technologies: 'Tecnologías'
    },
    // Contact section
    contact: {
      title: 'Contáctame',
      subtitle: 'Trabajemos juntos',
      name: 'Nombre',
      email: 'Correo',
      message: 'Mensaje',
      send: 'Enviar Mensaje',
      success: '¡Mensaje enviado con éxito!',
      error: 'Error al enviar mensaje'
    },
    // Common
    common: {
      loading: 'Cargando...',
      error: 'Ocurrió un error',
      retry: 'Reintentar',
      close: 'Cerrar'
    }
  }
}

// Language context hook
export const useTranslation = (language = 'en') => {
  const t = (key) => {
    const keys = key.split('.')
    let value = translations[language]
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        // Fallback to English if translation not found
        value = translations.en
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey]
          } else {
            return key // Return key if no translation found
          }
        }
        break
      }
    }
    
    return value
  }

  return { t, language }
}

// Language detection
export const detectLanguage = () => {
  if (typeof window === 'undefined') return 'en'
  
  const browserLang = navigator.language || navigator.userLanguage
  const shortLang = browserLang.split('-')[0]
  
  // Return supported language or default to English
  return translations[shortLang] ? shortLang : 'en'
}

export default translations
