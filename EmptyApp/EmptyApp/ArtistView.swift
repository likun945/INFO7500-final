import SwiftUI

struct Layout: View {
    var title: String
    @State private var selectedArtist: Artist?
    @State private var filteredArtists: [Artist] = []
    @State private var searchArtists: [Artist] = []
    @State private var contentMode = 0
    @State private var newArtistName: String = ""
    @State private var alertType: AlertType = .none
    @State private var searchText: String = ""
    enum AlertType {
        case none
        case noSelection
        case creationSuccess
        case deleteSuccess
        case updateSuccess
        case emptyForm
        case noResult
        case deleteNotAllowed
    }
    
    init(title: String) {
        self.title = title
        _filteredArtists = State(initialValue: DataManager.shared.loadData(forKey: "artists") ?? [])
    }
    
    var body: some View {
        VStack(spacing: 0) {
            if contentMode == 0 {
                TextField("Search \(title)", text: $searchText, onCommit: filterArtists)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .padding([.horizontal, .top])
                HStack(spacing: 20) {
                    Button("Add") {
                        contentMode = 1
                    }
                    Button("Display All") {
                        contentMode = 5
                    }
                }
                .padding(.horizontal)
                .padding(.bottom,10)
                .padding(.top, 10)
            }
            ZStack(alignment: .topLeading) {
                if contentMode == 1 {
                    VStack {
                        HStack {
                            Button(action: {
                                contentMode = 0
                                selectedArtist = nil
                            }) {
                                Image(systemName: "arrow.left")
                                    .foregroundColor(.blue)
                            }
                            .padding(.leading)

                            Text("New Artist")
                                .font(.headline)
                                .padding(.top, 5)
                                .padding(.bottom, 5)

                            Spacer()
                        }
                        TextField("Enter Artist Name", text: $newArtistName)
                            .textFieldStyle(RoundedBorderTextFieldStyle())
                            .padding()
                        Button("Submit") {
                            if !newArtistName.isEmpty {
                                let newArtistID = Int.random(in: 1...100)
                                let newArtist = Artist(id: newArtistID, name: newArtistName)
                                filteredArtists.append(newArtist)
                                newArtistName = ""
                                DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                                    alertType = .creationSuccess
                                }
                                contentMode = 0
                                DataManager.shared.saveData(filteredArtists, forKey: "artists")
                            }
                        }
                        .disabled(newArtistName.isEmpty)
                        .padding()
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.horizontal)
                } else if contentMode == 2 {
                    VStack {
                        HStack {
                            Button(action: {
                                contentMode = 5
                            }) {
                                Image(systemName: "arrow.left")
                                    .foregroundColor(.blue)
                            }
                            .padding(.leading)

                            Text("View Artist")
                                .font(.headline)
                                .padding(.top, 5)
                                .padding(.bottom, 5)

                            Spacer()
                        }
                        
                        if let artist = selectedArtist {
                            VStack(alignment: .leading) {
                                Text("ID: \(artist.id)")
                                Text("Name: \(artist.name)")
                            }
                        } else {
                            EmptyView()
                        }
                    }
                    .padding(.horizontal)
                } else if contentMode == 3 {
                    VStack {
                        HStack {
                            Button(action: {
                                contentMode = 5
                                selectedArtist = nil
                            }) {
                                Image(systemName: "arrow.left")
                                    .foregroundColor(.blue)
                            }
                            .padding(.leading)

                            Text("Update Artist")
                                .font(.headline)
                                .padding(.top, 5)
                                .padding(.bottom, 5)

                            Spacer()
                        }
                        TextField("Enter Artist Name", text: Binding(
                            get: { selectedArtist!.name },
                            set: { selectedArtist!.name = $0 }
                        ))
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .padding()
                        Button("Update") {
                            if let currentSelectedArtist = selectedArtist {
                                if let index = filteredArtists.firstIndex(where: { $0.id == currentSelectedArtist.id }) {
                                    if let updatedName = selectedArtist?.name, !updatedName.isEmpty { // 检查文本是否为空
                                        filteredArtists[index].name = updatedName
                                        alertType = .updateSuccess
                                        selectedArtist = nil
                                        contentMode = 0
                                        DataManager.shared.saveData(filteredArtists, forKey: "artists")
                                    } else {
                                        alertType = .emptyForm
                                    }
                                }
                            }
                        }
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.horizontal)
                } else if contentMode == 4 {
                    VStack {
                        HStack {
                            Button(action: {
                                contentMode = 0
                                selectedArtist = nil
                            }) {
                                Image(systemName: "arrow.left")
                                    .foregroundColor(.blue)
                            }
                            .padding(.leading)
                            
                            Text("Search Artist List")
                                .font(.headline)
                                .padding(.top, 5)
                                .padding(.bottom, 5)
                            
                            Spacer()
                        }
                        
                        List(searchArtists, id: \.id) { artist in
                            VStack(alignment: .leading) {
                                Text("Name: \(artist.name)")
                            }
                            .padding()
                        }
                        .listStyle(PlainListStyle())
                    }
                } else if contentMode == 5 {
                    VStack {
                        HStack {
                            Button(action: {
                                contentMode = 0
                                selectedArtist = nil
                            }) {
                                Image(systemName: "arrow.left")
                                    .foregroundColor(.blue)
                            }
                            .padding(.leading)

                            Text("Artist List")
                                .font(.headline)
                                .padding(.top, 5)
                                .padding(.bottom, 5)
                            
                            Spacer()
                        }
                        HStack {
                            Button(action: {
                                if selectedArtist != nil {
                                    contentMode = 3
                                } else {
                                    alertType = .noSelection
                                }
                            }) {
                                HStack {
                                    Image(systemName: "pencil.circle.fill")
                                        .foregroundColor(.blue)
                                    Text("Update")
                                        .foregroundColor(.blue)
                                }
                            }
                            .padding(.trailing, 8)
                            
                            Button(action: {
                                if filteredArtists.count > 1 {
                                    if let artistToDelete = selectedArtist,
                                       let index = filteredArtists.firstIndex(where: { $0.id == artistToDelete.id }) {
                                        // 执行删除操作
                                        filteredArtists.remove(at: index)
                                        selectedArtist = nil
                                        alertType = .deleteSuccess
                                        DataManager.shared.saveData(filteredArtists, forKey: "artists")
                                    } else {
                                        // 如果没有选中的艺术家
                                        alertType = .noSelection
                                    }
                                } else {
                                    // 如果 filteredArtists 数组中的元素少于或等于1，不允许删除
                                    alertType = .deleteNotAllowed
                                }

                            }) {
                                HStack {
                                    Image(systemName: "trash.circle.fill")
                                        .foregroundColor(.red)
                                    Text("Delete")
                                        .foregroundColor(.red)
                                }
                            }
                            .padding(.trailing, 8)
                            Button(action: {
                                if selectedArtist != nil {
                                    contentMode = 2
                                } else {
                                    alertType = .noSelection
                                }
                            }) {
                                HStack {
                                    Image(systemName: "eye.circle.fill")
                                        .foregroundColor(.green)
                                    Text("View")
                                        .foregroundColor(.green)
                                }
                            }
                        }
                        .padding(.leading)
                        List(filteredArtists, id: \.id, selection: $selectedArtist) { artist in
                            VStack(alignment: .leading) {
                                Text("Name: \(artist.name)")
                            }
                            .padding()
                            .background(selectedArtist == artist ? Color.blue.opacity(0.3) : Color.clear)
                            .onTapGesture {
                                selectedArtist = artist
                            }
                        }
                        .listStyle(PlainListStyle())
                    }
                } else {
                    EmptyView()
                }
            }
            Spacer()
        }
        .onAppear {
            contentMode = 0
            filteredArtists = DataManager.shared.loadData(forKey: "artists") ?? []
            resetForm()
        }
        .alert(isPresented: alertBinding) {
            switch alertType {
            case .noSelection:
                return Alert(title: Text("Error"), message: Text("Please select an \(title)."), dismissButton: .default(Text("OK")))
            case .creationSuccess:
                return Alert(title: Text("Success"), message: Text("\(title) created successfully!"), dismissButton: .default(Text("OK")))
            case .deleteSuccess:
                return Alert(title: Text("Success"), message: Text("\(title) deleted successfully!"), dismissButton: .default(Text("OK")))
            case .updateSuccess:
                return Alert(title: Text("Success"), message: Text("\(title) updated successfully!"), dismissButton: .default(Text("OK")))
            case .emptyForm:
                return Alert(title: Text("Error"), message: Text("Please fill all fields."), dismissButton: .default(Text("OK")))
            case .noResult:
                return Alert(title: Text("Error"), message: Text("No result"), dismissButton: .default(Text("OK")))
            case .deleteNotAllowed:
                    return Alert(title: Text("Delete Not Allowed"), message: Text("At least one artist must remain."), dismissButton: .default(Text("OK")))
            default:
                return Alert(title: Text(""), message: Text(""), dismissButton: .default(Text("")))
            }
        }
    }
    
    var alertBinding: Binding<Bool> {
        Binding<Bool>(
            get: { alertType != .none },
            set: { newValue in
                if !newValue {
                    alertType = .none
                }
            }
        )
    }
    func resetForm() {
        newArtistName = ""
        selectedArtist = nil
    }
    func filterArtists() {
        if searchText.isEmpty {
            searchArtists = filteredArtists
        } else {
            searchArtists = filteredArtists.filter { $0.name.lowercased().contains(searchText.lowercased()) }
        }
        if searchArtists.isEmpty {
            alertType = .noResult
        } else {
            contentMode = 4
        }
    }
}

struct Layout_Previews: PreviewProvider {
    static var previews: some View {
        GenreView(title: "Example")
    }
}
