// mobile/assets/styles/create.styles.js
import { StyleSheet, Dimensions } from 'react-native';
import COLORS from '../../constants/colors';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    // Header Styles
    headerContainer: {
        backgroundColor: COLORS.primary,
        paddingTop: 20,
        paddingBottom: 25,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        // Add shadow
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 1,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    logoContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        // Add shadow for logo container
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    logoImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    headerTextContainer: {
        flex: 1,
    },
    brandName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    headerText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 4,
    },
    subText: {
        fontSize: 14,
        color: '#fff',
        opacity: 0.9,
    },
    decorativeLine: {
        height: 3,
        width: 60,
        backgroundColor: '#fff',
        marginTop: 15,
        alignSelf: 'center',
        borderRadius: 2,
        opacity: 0.7,
    },
    // Scroll Content
    scrollContent: {
        flex: 1,
    },
    scrollContentContainer: {
        paddingTop: 20,
        paddingBottom: 40, // Extra padding at bottom for scrolling
    },
    inputGroup: {
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        color: COLORS.text,
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    captionInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    starsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    starContainer: {
        marginRight: 8,
    },
    imageUploadContainer: {
        width: '100%',
        height: 200,
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    uploadedImage: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
    },
    uploadText: {
        marginTop: 8,
        fontSize: 14,
        color: COLORS.gray,
    },
    submitButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 20,
        marginHorizontal: 20,
        marginBottom: 20,
        // Add shadow
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    submitButtonDisabled: {
        opacity: 0.5,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    bottomPadding: {
        height: 40, // Extra space at bottom
    }
});

export default styles;