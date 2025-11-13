package com.hunter_connect.handlers;

import com.hunter_connect.models.File;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.function.ServerRequest;
import org.springframework.web.servlet.function.ServerResponse;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Handles the business logic for file-related requests.
 * The @Component annotation allows Spring to detect and inject this class.
 *
 * Note: This handler manages file *metadata*. A real file upload
 * would typically involve handling multipart/form-data.
 */
@Component
public class FileHandler {

    private final Map<Long, File> files = new ConcurrentHashMap<>();
    private final AtomicLong counter = new AtomicLong();

    public FileHandler() {
        // Pre-populate with some mock file data
        long id1 = counter.incrementAndGet();
        files.put(id1, new File(
                id1,
                "document_v1.pdf",
                "application/pdf",
                1024 * 500, // 500 KB
                "/uploads/document_v1.pdf",
                LocalDateTime.now().minusDays(1)
        ));

        long id2 = counter.incrementAndGet();
        files.put(id2, new File(
                id2,
                "profile_pic.png",
                "image/png",
                1024 * 120, // 120 KB
                "/uploads/profile_pic.png",
                LocalDateTime.now().minusHours(3)
        ));
    }

    /**
     * Retrieves all file metadata records.
     */
    public ServerResponse getAllFiles(ServerRequest request) throws IOException {
        List<File> fileList = new ArrayList<>(files.values());
        return ServerResponse.ok().body(fileList);
    }

    /**
     * Retrieves a single file metadata record by its ID.
     */
    public ServerResponse getFileById(ServerRequest request) throws IOException {
        long fileId = Long.parseLong(request.pathVariable("id"));
        File file = files.get(fileId);

        if (file != null) {
            return ServerResponse.ok().body(file);
        } else {
            return ServerResponse.notFound().build();
        }
    }

    /**
     * Creates a new file metadata record.
     * This simulates creating a record after a file upload.
     */
    public ServerResponse createFile(ServerRequest request) throws IOException {
        try {
            // Assumes the request body contains metadata for a file that has been uploaded
            File fileRequest = request.body(File.class);
            long newId = counter.incrementAndGet();

            File newFile = new File(
                    newId,
                    fileRequest.getFileName(),
                    fileRequest.getFileType(),
                    fileRequest.getFileSize(),
                    fileRequest.getUrl(), // The URL/path would be provided by the upload logic
                    LocalDateTime.now() // Set the timestamp to now
            );

            files.put(newId, newFile);
            return ServerResponse.status(201).body(newFile);
        } catch (Exception e) {
            return ServerResponse.badRequest().body("Invalid file data: " + e.getMessage());
        }
    }
}