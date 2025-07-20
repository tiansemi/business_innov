
import { 
  Box, 
  Input, 
  Button, 
  VStack, 
  Text, 
  HStack, 
  Badge,
  Flex,
  Grid,
  GridItem,
  Card,
  CardBody,
  Heading,
  IconButton,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Alert,
  AlertIcon,
  List,
  ListItem,
  ListIcon,
  Divider
} from "@chakra-ui/react";
import { MicrophoneIcon, SparklesIcon, BuildingOfficeIcon, SpeakerWaveIcon, PlayIcon, PauseIcon, DocumentTextIcon, ExclamationTriangleIcon, WrenchScrewdriverIcon, LightBulbIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

// Predefined business suggestions
const businessSuggestions = [
  { id: 1, name: "Vente de vêtements", category: "Commerce", icon: "👕", description: "Boutique de mode et accessoires" },
  { id: 2, name: "Restaurant", category: "Restauration", icon: "🍽️", description: "Service de restauration locale" },
  { id: 3, name: "Coiffure", category: "Services", icon: "✂️", description: "Salon de coiffure et beauté" },
  { id: 4, name: "Mécanique auto", category: "Automobile", icon: "🔧", description: "Réparation et entretien véhicules" },
  { id: 5, name: "Boulangerie", category: "Alimentation", icon: "🍞", description: "Production et vente de pain" },
  { id: 6, name: "Épicerie", category: "Commerce", icon: "🛒", description: "Vente de produits alimentaires" },
  { id: 7, name: "Transport", category: "Services", icon: "🚗", description: "Service de transport de personnes" },
  { id: 8, name: "Agriculture", category: "Agriculture", icon: "🌱", description: "Production agricole locale" }
];

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeakingIndex, setCurrentSpeakingIndex] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const bottomRef = useRef(null);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSend = (businessText = null) => {
    const textToSend = businessText || input;
    if (!textToSend.trim()) return;

    setThinking(true);
    setShowSuggestions(false);
    setMessages(prev => [...prev, { text: textToSend, from: "user" }]);
    setInput("");

    // Make multiple API calls for enhanced features
    Promise.all([
      axios.get(`http://127.0.0.1:8000/prompt/${encodeURIComponent(textToSend)}`),
      axios.get(`http://127.0.0.1:8000/prompt/${encodeURIComponent(`Génère 3 études de cas détaillées pour l'activité "${textToSend}" en Côte d'Ivoire avec des exemples concrets de réussite et d'échec`)}`),
      axios.get(`http://127.0.0.1:8000/prompt/${encodeURIComponent(`Liste les étapes détaillées d'implémentation du projet "${textToSend}" avec un calendrier suggéré`)}`),
      axios.get(`http://127.0.0.1:8000/prompt/${encodeURIComponent(`Identifie les 10 principaux risques pour l'activité "${textToSend}" en Côte d'Ivoire et comment les éviter`)}`),
      axios.get(`http://127.0.0.1:8000/prompt/${encodeURIComponent(`Liste tous les outils, équipements et ressources nécessaires pour démarrer "${textToSend}" avec les prix approximatifs en Côte d'Ivoire`)}`),
    ])
    .then(([mainResponse, caseStudies, implementationSteps, risks, tools]) => {
      const analysisResult = {
        main: mainResponse.data.resultat1?.replace(/^```html\s*/i, "")?.replace(/```$/, "") || "Réponse vide reçue",
        caseStudies: caseStudies.data.resultat1?.replace(/^```html\s*/i, "")?.replace(/```$/, "") || "Données non disponibles",
        implementationSteps: implementationSteps.data.resultat1?.replace(/^```html\s*/i, "")?.replace(/```$/, "") || "Données non disponibles",
        risks: risks.data.resultat1?.replace(/^```html\s*/i, "")?.replace(/```$/, "") || "Données non disponibles",
        tools: tools.data.resultat1?.replace(/^```html\s*/i, "")?.replace(/```$/, "") || "Données non disponibles"
      };
      
      setAnalysisData(analysisResult);
      setMessages(prev => [
        ...prev,
        {
          text: analysisResult.main,
          from: "ai",
          hasAnalysis: true,
          analysisData: analysisResult
        },
      ]);
      setThinking(false);
    })
    .catch((error) => {
      console.log(error);
      setMessages(prev => [
        ...prev,
        {
          text: `<strong style="color: #e53e3e;">Une erreur est survenue, veuillez réessayer</strong>`,
          from: "ai",
        },
      ]);
      setThinking(false);
      toast({
        title: "Erreur",
        description: "Impossible de contacter le serveur",
        status: "error",
        duration: 3000,
      });
    });
  };

  const handleBusinessSelect = (business) => {
    setSelectedBusiness(business);
    onOpen();
  };

  const confirmBusinessSelection = () => {
    handleSend(selectedBusiness.name);
    onClose();
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast({
        title: "Non supporté",
        description: "La reconnaissance vocale n'est pas supportée sur ce navigateur",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      toast({
        title: "Reconnaissance vocale",
        description: `Texte reconnu: "${transcript}"`,
        status: "success",
        duration: 3000,
      });
    };

    recognition.onerror = () => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la reconnaissance vocale",
        status: "error",
        duration: 3000,
      });
      setIsRecording(false);
    };

    recognition.start();
  };

  const handleReadAloud = (text, messageIndex) => {
    if (!('speechSynthesis' in window)) {
      toast({
        title: "Non supporté",
        description: "La synthèse vocale n'est pas supportée sur ce navigateur",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    // Stop current speech if speaking
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentSpeakingIndex(null);
      return;
    }

    // Create enhanced description of the content
    const cleanText = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const enhancedDescription = `Voici l'analyse détaillée pour votre projet d'entreprise. ${cleanText}`;

    const utterance = new SpeechSynthesisUtterance(enhancedDescription);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentSpeakingIndex(messageIndex);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentSpeakingIndex(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setCurrentSpeakingIndex(null);
      toast({
        title: "Erreur",
        description: "Erreur lors de la lecture vocale",
        status: "error",
        duration: 3000,
      });
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Box
      minH="100vh"
      bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      py={8}
      px={4}
    >
      <Box maxW="1200px" mx="auto">
        {/* Header */}
        <VStack spacing={6} mb={8}>
          <Heading
            size="2xl"
            color="white"
            textAlign="center"
            textShadow="2px 2px 4px rgba(0,0,0,0.3)"
          >
            🚀 ExpGainer - Votre Assistant Business
          </Heading>
          <Text
            fontSize="lg"
            color="whiteAlpha.900"
            textAlign="center"
            maxW="600px"
          >
            Découvrez comment démarrer et développer votre activité en Côte d'Ivoire
          </Text>
        </VStack>

        {/* Business Suggestions */}
        {showSuggestions && (
          <Box
            bg="white"
            borderRadius="xl"
            p={6}
            mb={6}
            boxShadow="xl"
          >
            <Heading size="lg" mb={4} color="gray.700">
              💡 Projets d'entreprise populaires
            </Heading>
            <Grid templateColumns="repeat(auto-fit, minmax(280px, 1fr))" gap={4}>
              {businessSuggestions.map((business) => (
                <Card
                  key={business.id}
                  cursor="pointer"
                  transition="all 0.2s"
                  _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
                  onClick={() => handleBusinessSelect(business)}
                >
                  <CardBody>
                    <HStack spacing={3}>
                      <Text fontSize="2xl">{business.icon}</Text>
                      <Box flex={1}>
                        <HStack justify="space-between" mb={1}>
                          <Text fontWeight="bold" color="gray.700">
                            {business.name}
                          </Text>
                          <Badge colorScheme="blue" size="sm">
                            {business.category}
                          </Badge>
                        </HStack>
                        <Text fontSize="sm" color="gray.600">
                          {business.description}
                        </Text>
                      </Box>
                    </HStack>
                  </CardBody>
                </Card>
              ))}
            </Grid>
          </Box>
        )}

        {/* Chat Interface */}
        <Box
          bg="white"
          borderRadius="xl"
          boxShadow="2xl"
          overflow="hidden"
          h="600px"
          display="flex"
          flexDirection="column"
        >
          {/* Chat Header */}
          <Box
            bg="linear-gradient(90deg, #4299e1, #3182ce)"
            p={4}
            color="white"
          >
            <HStack>
              <Text fontSize="lg" fontWeight="bold">
                💬 Consultation Expert
              </Text>
              <Badge colorScheme="green" ml="auto">
                En ligne
              </Badge>
            </HStack>
          </Box>

          {/* Messages Area */}
          <VStack
            flex={1}
            overflowY="auto"
            spacing={4}
            align="stretch"
            p={4}
            bg="gray.50"
          >
            {messages.length === 0 && (
              <Box textAlign="center" py={8}>
                <Text fontSize="xl" color="gray.500" mb={2}>
                  👋 Bonjour ! Comment puis-je vous aider ?
                </Text>
                <Text color="gray.400">
                  Sélectionnez un projet ci-dessus ou décrivez votre idée d'entreprise
                </Text>
              </Box>
            )}

            {messages.map((msg, idx) => (
              <Box
                key={idx}
                alignSelf={msg.from === "user" ? "flex-end" : "flex-start"}
                maxW={msg.from === "ai" && msg.hasAnalysis ? "95%" : "80%"}
              >
                <Box
                  bg={msg.from === "user" ? "blue.500" : "white"}
                  color={msg.from === "user" ? "white" : "gray.800"}
                  p={4}
                  borderRadius="lg"
                  boxShadow="md"
                  border={msg.from === "ai" ? "1px solid" : "none"}
                  borderColor="gray.200"
                >
                  {msg.from === "ai" ? (
                    <VStack spacing={4} align="stretch">
                      <HStack justify="space-between">
                        <Text fontSize="sm" fontWeight="bold" color="blue.600">
                          💼 Analyse Business Complète
                        </Text>
                        <IconButton
                          size="sm"
                          icon={
                            isSpeaking && currentSpeakingIndex === idx ? (
                              <PauseIcon width="16px" height="16px" />
                            ) : (
                              <SpeakerWaveIcon width="16px" height="16px" />
                            )
                          }
                          onClick={() => handleReadAloud(msg.text, idx)}
                          colorScheme={isSpeaking && currentSpeakingIndex === idx ? "red" : "blue"}
                          aria-label="Lecture vocale"
                          title="Écouter l'analyse détaillée"
                        />
                      </HStack>
                      
                      {msg.hasAnalysis ? (
                        <Tabs variant="enclosed" size="sm">
                          <TabList>
                            <Tab fontSize="xs">
                              <HStack spacing={1}>
                                <SparklesIcon width="14px" height="14px" />
                                <Text>Analyse Principale</Text>
                              </HStack>
                            </Tab>
                            <Tab fontSize="xs">
                              <HStack spacing={1}>
                                <DocumentTextIcon width="14px" height="14px" />
                                <Text>Études de Cas</Text>
                              </HStack>
                            </Tab>
                            <Tab fontSize="xs">
                              <HStack spacing={1}>
                                <LightBulbIcon width="14px" height="14px" />
                                <Text>Étapes d'Implémentation</Text>
                              </HStack>
                            </Tab>
                            <Tab fontSize="xs">
                              <HStack spacing={1}>
                                <ExclamationTriangleIcon width="14px" height="14px" />
                                <Text>Risques</Text>
                              </HStack>
                            </Tab>
                            <Tab fontSize="xs">
                              <HStack spacing={1}>
                                <WrenchScrewdriverIcon width="14px" height="14px" />
                                <Text>Outils Nécessaires</Text>
                              </HStack>
                            </Tab>
                          </TabList>
                          
                          <TabPanels>
                            <TabPanel p={3}>
                              <Box dangerouslySetInnerHTML={{ __html: msg.analysisData.main }} />
                            </TabPanel>
                            <TabPanel p={3}>
                              <Alert status="info" mb={3}>
                                <AlertIcon />
                                <Text fontSize="sm">Exemples concrets de réussite et d'échec dans votre secteur</Text>
                              </Alert>
                              <Box dangerouslySetInnerHTML={{ __html: msg.analysisData.caseStudies }} />
                            </TabPanel>
                            <TabPanel p={3}>
                              <Alert status="success" mb={3}>
                                <AlertIcon />
                                <Text fontSize="sm">Plan détaillé avec calendrier suggéré</Text>
                              </Alert>
                              <Box dangerouslySetInnerHTML={{ __html: msg.analysisData.implementationSteps }} />
                            </TabPanel>
                            <TabPanel p={3}>
                              <Alert status="warning" mb={3}>
                                <AlertIcon />
                                <Text fontSize="sm">Risques identifiés et stratégies de prévention</Text>
                              </Alert>
                              <Box dangerouslySetInnerHTML={{ __html: msg.analysisData.risks }} />
                            </TabPanel>
                            <TabPanel p={3}>
                              <Alert status="info" mb={3}>
                                <AlertIcon />
                                <Text fontSize="sm">Équipements et ressources avec estimations de prix</Text>
                              </Alert>
                              <Box dangerouslySetInnerHTML={{ __html: msg.analysisData.tools }} />
                            </TabPanel>
                          </TabPanels>
                        </Tabs>
                      ) : (
                        <Box dangerouslySetInnerHTML={{ __html: msg.text }} />
                      )}
                    </VStack>
                  ) : (
                    <Text>{msg.text}</Text>
                  )}
                </Box>
                <HStack justify={msg.from === "user" ? "flex-end" : "flex-start"} mt={1}>
                  <Text fontSize="xs" color="gray.500">
                    {msg.from === "user" ? "Vous" : "Expert Business"}
                  </Text>
                  {msg.from === "ai" && isSpeaking && currentSpeakingIndex === idx && (
                    <Badge colorScheme="blue" size="sm">
                      🔊 En lecture
                    </Badge>
                  )}
                </HStack>
              </Box>
            ))}

            {thinking && (
              <Box alignSelf="flex-start" maxW="80%">
                <Box
                  bg="white"
                  p={4}
                  borderRadius="lg"
                  boxShadow="md"
                  border="1px solid"
                  borderColor="gray.200"
                >
                  <HStack>
                    <Box
                      as="div"
                      w="3"
                      h="3"
                      bg="blue.500"
                      borderRadius="full"
                      animation="bounce 1s infinite"
                    />
                    <Box
                      as="div"
                      w="3"
                      h="3"
                      bg="blue.500"
                      borderRadius="full"
                      animation="bounce 1s infinite 0.1s"
                    />
                    <Box
                      as="div"
                      w="3"
                      h="3"
                      bg="blue.500"
                      borderRadius="full"
                      animation="bounce 1s infinite 0.2s"
                    />
                    <Text ml={2} color="gray.600">L'expert analyse votre demande...</Text>
                  </HStack>
                </Box>
              </Box>
            )}

            <div ref={bottomRef} />
          </VStack>

          {/* Input Area */}
          <Box p={4} bg="white" borderTop="1px solid" borderColor="gray.200">
            <HStack spacing={2}>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Décrivez votre projet d'entreprise..."
                flex={1}
                bg="gray.50"
                border="2px solid"
                borderColor="gray.300"
                _focus={{ borderColor: "blue.500", bg: "white" }}
              />
              <IconButton
                icon={<MicrophoneIcon width="20px" height="20px" />}
                onClick={handleVoiceInput}
                colorScheme={isRecording ? "red" : "gray"}
                aria-label="Reconnaissance vocale"
                isLoading={isRecording}
              />
              <Button
                onClick={() => handleSend()}
                colorScheme="blue"
                isDisabled={!input.trim()}
                leftIcon={<SparklesIcon width="16px" height="16px" />}
              >
                Envoyer
              </Button>
            </HStack>
          </Box>
        </Box>
      </Box>

      {/* Business Selection Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmer votre sélection</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedBusiness && (
              <VStack spacing={4}>
                <HStack>
                  <Text fontSize="3xl">{selectedBusiness.icon}</Text>
                  <Box>
                    <Text fontSize="xl" fontWeight="bold">
                      {selectedBusiness.name}
                    </Text>
                    <Badge colorScheme="blue">{selectedBusiness.category}</Badge>
                  </Box>
                </HStack>
                <Text textAlign="center" color="gray.600">
                  {selectedBusiness.description}
                </Text>
                <Text textAlign="center" fontSize="sm" color="gray.500">
                  Voulez-vous obtenir des conseils pour démarrer cette activité ?
                </Text>
                <HStack spacing={3} pt={4}>
                  <Button variant="outline" onClick={onClose}>
                    Annuler
                  </Button>
                  <Button colorScheme="blue" onClick={confirmBusinessSelection}>
                    Continuer
                  </Button>
                </HStack>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
